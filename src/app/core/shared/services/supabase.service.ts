import { Injectable } from '@angular/core';
import { AuthChangeEvent, AuthSession, createClient, Session, SupabaseClient, User} from '@supabase/supabase-js';
import { environment } from 'src/environments/environment';
import { BudgetAlertClass, BudgetPercentage, UserRoles} from '../../models-interface/enums';
import { Subject } from 'rxjs';

export interface Profile {
  id?: string;
  username: string;
  website: string;
  full_name: string;
  role?: string;
}

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient;
  _session: AuthSession | null = null;
  eventSubject = new Subject<AuthChangeEvent>();

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey,
    );
  }

  get session() {
    this.supabase.auth.getSession().then(({ data }) => {
      this._session = data.session;
    });
    return this._session;
  }
  async getUser() {
    let {
      data: { user },
    } = await this.supabase.auth.getUser();
    if (user) {
      const user_meta = (await this.profile(user)).data;
      const userComplete = { ...user, user_meta };
      return userComplete;
    } else {
      return user;
    }
  }
  profile(user: User) {
    return this.supabase
      .from('profiles')
      .select(`id, username, full_name, avatar_url, website, role`)
      .eq('id', user?.id)
      .single();
  }

  authChanges(
    callback: (event: AuthChangeEvent, session: Session | null) => void,
  ) {
    this.supabase.auth.onAuthStateChange((event, session) => {
      callback(event, session);
      // console.log('eventoo', event);
      // console.log('session', session);
      // Emitir el valor de event al observable
      this.eventSubject.next(event);
    });
  }

  async loginWithPassword(email: string, pass: string) {
    if (!email || !pass)
      throw new Error('El correo y password son obligatorios');
    let { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password: pass,
    });
    if (error) {
      console.log(`Error: ${error.message}`);
      throw new Error(`Ha ocurrido un error al momento del logueo.`);
    }
    let userLogged: any = {
      session: data.session,
      user: data.user,
      profile: data.user ? (await this.profile(data.user)).data : null,
    };
    return { userLogged, error };
  }
  loginWithOtp(email: string) {
    if (!email) throw new Error('El correo y password son obligatorios');
    return this.supabase.auth.signInWithOtp({ 
      email, 
      options: {
      emailRedirectTo: `${environment.baseUrl}intranet/movimientos`,
    } });
  }
  async signUp(email: string, pass: string) {
    if (!email || !pass)
      throw new Error('El correo y password son obligatorios');

    let { data, error } = await this.supabase.auth.signUp({
      email,
      password: pass,
      options: {
        emailRedirectTo: `${environment.baseUrl}login`,
        data: {
          role: UserRoles.Normal,
        },
      },
    });
    if (error) {
      console.log(`Error: ${error.message}`);
      throw new Error(`Ha ocurrido un error al momento de crear el usuario.`);
    }
    if (!error && data.user) {
      await this.createProfile(data.user.id).then((resp: any) => {
        if (resp.error)
          throw new Error('Ha ocurrido algun error al crear el perfil');
      });
    }
    return { data, error };
  }
  async sendConfirmationEmail(email: string) {
    const { data, error } = await this.supabase.auth.resend({
      type: 'signup',
      email,
    });
  }
  signOut() {
    return this.supabase.auth.signOut();
  }
  async createProfile(user_uuid: string) {
    try {
      if (!user_uuid) throw new Error('El id del usuario es obligatorio');
      const { data, error } = await this.supabase
        .from('profiles')
        .insert({ id: user_uuid, role: UserRoles.Normal })
        .select();
      if (error) {
        console.log(`Error: ${error.message}`);
        throw new Error(
          `Ha ocurrido un error al momento de crear el perfil del usuario.`,
        );
      }
      return { data, error };
    } catch (error) {
      console.warn(error);
      return error;
    }
  }
  updateProfile(profile: Profile) {
    const update = {
      ...profile,
      updated_at: new Date(),
    };
    return this.supabase.from('profiles').upsert(update);
  }

  downLoadImage(path: string) {
    return this.supabase.storage.from('avatars').download(path);
  }

  uploadAvatar(filePath: string, file: File) {
    return this.supabase.storage.from('avatars').upload(filePath, file);
  }
  async requestResetPass(email: string) {
    if (!email) throw new Error('El email del usuario es obligatorio');
    const { data, error } = await this.supabase.auth.resetPasswordForEmail(
      email,
      {
        redirectTo: `${environment.baseUrl}reset-password`,
      },
    );
    if (error) {
      console.log(`Error: ${error.message}`);
      throw new Error(
        `Ha ocurrido un error al momento de solicitar el reseteo del password.`,
      );
    }
    return { data, error };
  }

  async chancgeRoleUser(user_uuid: string) {
    const user = await this.supabase.auth.updateUser({
      data: { role: 'world' },
    });

    const profile = await this.supabase
      .from('profiles')
      .update({ role: 'world' })
      .eq('id', user_uuid)
      .select();

    return { user, profile };
  }

  async resetPassword(password: string) {
    try {
      if (!password) throw new Error('El password del usuario es obligatorio');
      const { data, error } = await this.supabase.auth.updateUser({
        password,
      });
      if (error) {
        console.log(`Error: ${error.message}`);
        throw new Error(
          `Ha ocurrido un error al momento de reseteo de password.`,
        );
      }
      return { data, error };
    } catch (error) {
      console.warn(error);
      return error;
    }
  }

  //CATEGORIES
  async getCategoriesExpenses(user_uuid: string, year?:number, month?:number){
    let query = this.supabase
    .from('category_expense_view')
    .select('*')
    .eq('user_uuid', user_uuid)
    if (year && month)  { 
      query = query.gte('budget_month', `${year}-${month}-01`)
      query = query.lt('budget_month', `${year}-${month+1}-01`)
    }
    query.order('category_name', { ascending: true })
    const { data: category_expense_view, error } = await query

    return { category_expense_view, error };
  }
  async getCategoriesIncome(user_uuid: string, year?:number, month?:number) {
    let query = this.supabase
    .from('category_income_view')
    .select('*')
    .eq('user_uuid', user_uuid)
    if (year && month)  { 
      query = query.gte('budget_month', `${year}-${month}-01`)
      query = query.lt('budget_month', `${year}-${month+1}-01`)
    }
    query.order('category_name', { ascending: true })
    const { data:  category_income, error } = await query
    
    return {  category_income, error };
  }
  async getCategoriesExpensesDates(user_uuid: string) {

    let { data: categories_dates, error } = await this.supabase
      .from('category_expense_view')
      .select('budget_month')
      .eq('user_uuid', user_uuid)

    return { categories_dates, error };
  }
  async getAllCategoriesExpensesByUser(user_uuid:string){
    let { data: category_expenses, error } = await this.supabase
      .from('category_expense')
      .select('id, category_name,category_expense_description')
      .eq('user_uuid', user_uuid)
    return { category_expenses, error };
  }
  async getAllCategoriesIncomesByUser(user_uuid:string){
    let { data: category_incomes, error } = await this.supabase
      .from('category_income')
      .select('id, category_name,category_income_description')
      .eq('user_uuid', user_uuid)
    return { category_incomes, error };
  }
  async updateCategoryExpense(
    id_expense: string | number,
    category_name: string,
    category_expense_description: string,
  ) {
    const { data: category_updated, error } = await this.supabase
      .from('category_expense')
      .update({
        category_name,
        category_expense_description,
      })
      .eq('id', id_expense)
      .select();
    const data = category_updated?.map((item: any) => {
      item.showDetails = false;
      return item;
    });

    return { data, error };
  }
  async updateCategoryIncome(
    id_income: string | number,
    category_name: string,
    category_income_description: string,
  ) {
    const { data: category_updated, error } = await this.supabase
      .from('category_income')
      .update({
        category_name,
        category_income_description,
      })
      .eq('id', id_income)
      .select();
    const data = category_updated?.map((item: any) => {
      item.showDetails = false;
      return item;
    });

    return { data, error };
  }

  async deleteCategoryExpense(id_expense: string | number) {
    try {
      // Validar el tipo de id_expense
      if (typeof id_expense !== 'string' && typeof id_expense !== 'number') {
        throw new Error('id_expense debe ser una cadena de texto o un número');
      }

      const { error } = await this.supabase
        .from('category_expense')
        .delete()
        .eq('id', id_expense);

      if (error) {
        throw new Error('Error al eliminar la categoría de gasto');
      }

      return { error: null };
    } catch (error: any) {
      // Manejar el error y retornar el mensaje
      return { error: error.message };
    }
  }
  async deleteCategoryIncome(id_income: string | number) {
    try {
      // Validar el tipo de id_income
      if (typeof id_income !== 'string' && typeof id_income !== 'number') {
        console.log('entro aca');
        throw new Error('id_income debe ser una cadena de texto o un número');
      }

      const { error } = await this.supabase
        .from('category_income')
        .delete()
        .eq('id', id_income);

      if (error) {
        console.log('entro aquiii', error);
        throw new Error('Error al eliminar la categoría de ingreso');
      }

      return { error: null };
    } catch (error: any) {
      // Manejar el error y retornar el mensaje
      return { error: error.message };
    }
  }
  async createCategoryExpense(
    category_name: string,
    user_uuid: string,
    category_expense_description: string
  ) {
    try {
      // Validar el tipo de id_income
      if (!category_name || !user_uuid) {
        throw new Error('Todos los campos son requeridos');
      }
      const { data, error } = await this.supabase
        .from('category_expense')
        .insert([
          {
            category_name,
            user_uuid,
            category_expense_description,
          },
        ])
        .select();
      if (error) {
        console.log(error);
        throw new Error('Error al crear la categoría');
      }
      return { data };
    } catch (error: any) {
      // Manejar el error y retornar el mensaje
      return { error: error.message };
    }
  }

  async createCategoryIncome(
    category_name: string,
    user_uuid: string,
    category_income_description: string
  ) {
    try {
      // Validar el tipo de id_income
      if (!category_name || !user_uuid) {
        throw new Error('Todos los campos son requeridos');
      }
      const { data, error } = await this.supabase
        .from('category_income')
        .insert([
          {
            category_name,
            user_uuid,
            category_income_description,
          },
        ])
        .select();
      if (error) {
        throw new Error('Error al crear la categoria');
      }
      return { data };
    } catch (error: any) {
      // Manejar el error y retornar el mensaje
      return { error: error.message };
    }
  }

  async checkCategoryExpense(id_category_expense: number | string) {
    try {
      let { data: expenses, error } = await this.supabase
        .from('expenses')
        .select('*')
        .eq('category_expense_id', id_category_expense);
      if (error) {
        throw new Error('Error al consultar gastos asociados a la categoría');
      }
      return { expenses, error };
    } catch (error: any) {
      console.log(error);
      return { error: error.message };
    }
  }
  async checkCategoryIncome(id_category_income: number | string) {
    try {
      let { data: incomes, error } = await this.supabase
        .from('income')
        .select('*')
        .eq('category_income_id', id_category_income);
      if (error) {
        throw new Error('Error al consultar ingresos asociados a la categoría');
      }
      return { incomes, error };
    } catch (error: any) {
      console.log(error);
      return { error: error.message };
    }
  }

  //Expenses & Incomes
  async insertNewExpense(formData: {
    expense_date: string;
    description_expense: string;
    category_expense_id: number | string;
    expense_amount: number;
    user_uuid: string;
  }) {
    const { data, error } = await this.supabase
      .from('expenses')
      .insert([formData]);
    return { data, error };
  }
  async insertNewIncome(formData: {
    income_date: string;
    description_income: string;
    category_income_id: number | string;
    income_amount: number;
    user_uuid: string;
  }) {
    const { data, error } = await this.supabase
      .from('income')
      .insert([formData]);
    return { data, error };
  }

  async getExpensesHistory(user_uuid: string) {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    const { data: expense_history, error } = await this.supabase
      .from('expense_history_new')
      .select('*')
      .eq('user_uuid', user_uuid)
      .gte('date', `${currentYear}-${currentMonth}-01`)
      .lt('date', `${currentYear}-${currentMonth + 1}-01`);

    return { expense_history, error };
  }

  async getIncomesHistory(user_uuid: string) {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    let { data: income_history, error } = await this.supabase
      .from('income_history_new')
      .select('*')
      .eq('user_uuid', user_uuid)
      .gte('date', `${currentYear}-${currentMonth}-01`)
      .lt('date', `${currentYear}-${currentMonth + 1}-01`);
    return { income_history, error };
  }
  async updateExpense(
    id_expense: number,
    category_expense_id: number | string,
    description_expense: string,
    expense_amount: number,
    expense_date: Date | string,
  ) {
    const { data, error } = await this.supabase
      .from('expenses')
      .update({
        category_expense_id,
        description_expense,
        expense_amount,
        expense_date,
      })
      .eq('id', id_expense)
      .select();

    return { data, error };
  }
  async updateIncome(
    id_income: number,
    category_income_id: number | string,
    description_income: string,
    income_amount: number,
    income_date: Date | string,
  ) {
    const { data, error } = await this.supabase
      .from('income')
      .update({
        category_income_id,
        description_income,
        income_amount,
        income_date,
      })
      .eq('id', id_income)
      .select();

    return { data, error };
  }

  async deleteExpense(expense_id: number) {
    try {
      // Validar el tipo de id_income
      if (typeof expense_id !== 'number') {
        throw new Error('expense_id debe ser un número');
      }

      const { error } = await this.supabase
        .from('expenses')
        .delete()
        .eq('id', expense_id);

      if (error) {
        throw new Error('Error al eliminar la transacción');
      }

      return { error: null };
    } catch (error: any) {
      // Manejar el error y retornar el mensaje
      return { error: error.message };
    }
  }
  async deleteIncome(income_id: number) {
    try {
      // Validar el tipo de id_income
      if (typeof income_id !== 'number') {
        throw new Error('expense_id debe ser un número');
      }

      const { error } = await this.supabase
        .from('income')
        .delete()
        .eq('id', income_id);

      if (error) {
        throw new Error('Error al eliminar la transacción');
      }

      return { error: null };
    } catch (error: any) {
      // Manejar el error y retornar el mensaje
      return { error: error.message };
    }
  }

  //Budgets
  async getBudgets(user_uuid: string, year?:number, month?: number) {
    const currentDate = new Date();
    const currentYear = year? year :  currentDate.getFullYear();
    const currentMonth = month? month: currentDate.getMonth() + 1;
    const { data: budgets_view, error } = await this.supabase
      .from('budgets_view')
      .select('*')
      .eq('user_uuid', user_uuid)
      .gte('bugget_date', `${currentYear}-${currentMonth}-01`)
      .lt('bugget_date', `${currentYear}-${currentMonth + 1}-01`);

    const budgets = budgets_view?.map((item: any) => {
      item.class = BudgetAlertClass.Normal;

      let porcentaje = (item.budget_sum / item.budget_expected) * 100;

      if (porcentaje > BudgetPercentage.Over) {
        item.over = true;
      } else {
        item.over = false;
      }

      if (porcentaje >= 0 && porcentaje <= BudgetPercentage.Warning) {
        item.class = BudgetAlertClass.Normal;
      } else if (
        porcentaje > BudgetPercentage.Warning &&
        porcentaje < BudgetPercentage.Danger
      ) {
        item.class = BudgetAlertClass.Warning;
      } else {
        item.class = BudgetAlertClass.Danger;
      }
      return item;
    });
    return { budgets_view, error };
  }
  async createBudgetExpense( formData: {category_id: string | number,budget_expected: number,user_uuid: string, month?: number, year?:number}) {
    try {
      if (!formData.category_id || !formData.user_uuid) {
        throw new Error('Los parámetros son obligatorios');
      }
      const date = new Date();
      const AAAA = formData.year? formData.year : date.getFullYear();
      const MM = formData.month ? formData.month : date.getMonth() + 1;
      const DD = 1;
      const formattedDate = `${AAAA}-${MM.toString().padStart(2, '0')}-${DD.toString().padStart(2, '0')}`; // Formatea los componentes de la fecha en el formato deseado

      const { data: budgets, error } = await this.supabase
        .from('budgets')
        .insert([
          {
            budget_date: formattedDate,
            category_id: formData.category_id,
            budget_expected: formData.budget_expected,
            user_uuid: formData.user_uuid,
          },
        ])
        .select('*');

      if (error) {
        throw new Error('Error al crear el presupuesto');
      }

      return { budgets, error };
    } catch (error: any) {
      console.log(error);
      return { error: error.message };
    }
  }
  async createBudgetIncome(formData: {category_id: string | number,budget_expected: number,user_uuid: string, month?: number, year?:number}) {
    try {
      if (!formData.category_id || !formData.user_uuid) {
        throw new Error('Los parametros son obligatorios');
      }
      const date = new Date();
      const AAAA = formData.year? formData.year : date.getFullYear();
      const MM = formData.month ? formData.month : date.getMonth() + 1;
      const DD = 1;
      const formattedDate = `${AAAA}-${MM.toString().padStart(2, '0')}-${DD.toString().padStart(2, '0')}`; // Formatea los componentes de la fecha en el formato deseado

      const { data: budgets, error } = await this.supabase
        .from('budgets_incomes')
        .insert([
          {
            budget_date: formattedDate,
            category_id: formData.category_id,
            budget_expected: formData.budget_expected,
            user_uuid: formData.user_uuid,
          },
        ])
        .select('*');

      if (error) {
        throw new Error('Error al crear el presupuesto');
      }

      return { budgets, error };
    } catch (error: any) {
      console.log(error);
      return { error: error.message };
    }
  }
  async updateBudgetExpense(
    id_budget: string | number,
    budget_expected: number,
  ) {
    try {
      if (!id_budget || !budget_expected) {
        throw new Error('Los parametros son obligatorios');
      }
      const { data: budgets, error } = await this.supabase
        .from('budgets')
        .update({ budget_expected })
        .eq('id', id_budget)
        .select('*');

      if (error) {
        throw new Error('Error al actualizar el presupuesto');
      }

      return { budgets, error };
    } catch (error: any) {
      console.log(error);
      return { error: error.message };
    }
  }
  async updateBudgetIncome(
    id_budget: string | number,
    budget_expected: number,
  ) {
    try {
      if (!id_budget || !budget_expected) {
        throw new Error('Los parametros son obligatorios');
      }
      const { data: budgets, error } = await this.supabase
        .from('budgets_incomes')
        .update({ budget_expected })
        .eq('id', id_budget)
        .select('*');

      if (error) {
        throw new Error('Error al actualizar el presupuesto');
      }

      return { budgets, error };
    } catch (error: any) {
      console.log(error);
      return { error: error.message };
    }
  }
  async createManyBudgetsIncomes(){
    const arrayMany = [
      {category_name: 'hola1', user_uuid: 'beb95f5f-4b53-46ee-8003-e413a935c419', category_income_description: 'description1'},
      {category_name: 'hola2', user_uuid: 'beb95f5f-4b53-46ee-8003-e413a935c419', category_income_description: 'description2'},
      {category_name: 'hola3', user_uuid: 'beb95f5f-4b53-46ee-8003-e413a935c419', category_income_description: 'description3'},
      {category_name: 'hola4', user_uuid: 'beb95f5f-4b53-46ee-8003-e413a935c419', category_income_description: 'description4'},
    ]
    const { data, error } = await this.supabase
    .from('category_income')
    .insert(arrayMany)
    .select()

    console.log('juaaaaan', data);
  }
  async deleteBudgetExpense(budget_id: number | string){
    const { error } = await this.supabase
    .from('budgets')
    .delete()
    .eq('id', budget_id)
    return error;
  }
  async deleteBudgetIncome(budget_id: number | string){
    const { error } = await this.supabase
    .from('budgets_incomes')
    .delete()
    .eq('id', budget_id)
    return error;
  }
  // Estado de Perdidas y Ganancias
  async getGananciasPerdidasExpenses(user_uuid: string, month?:number, year?:number) {
    const currentDate = new Date();
    const currentYear = year? year :  currentDate.getFullYear();
    const currentMonth = month? month: currentDate.getMonth() + 1;
  
    // Primero, obtenemos la información de la tabla category_expense
    const { data: categoryData, error: categoryError } = await this.supabase
      .from('budgets_view')
      .select('category_id, category_name, user_uuid, budget_expected')
      .eq('user_uuid', user_uuid)
      .gte('bugget_date', `${currentYear}-${currentMonth}-01`)
      .lt('bugget_date', `${currentYear}-${currentMonth + 1}-01`);
  
    // Luego, obtenemos la información relacionada de la tabla expenses
    const { data: expensesData, error: expensesError } = await this.supabase
      .from('expenses')
      .select('category_expense_id, expense_date, expense_amount, user_uuid')
      .eq('user_uuid', user_uuid)
      .gte('expense_date', `${currentYear}-${currentMonth}-01`)
      .lt('expense_date', `${currentYear}-${currentMonth + 1}-01`);
  
    // Ahora combinamos los resultados usando el user_uuid como clave
    const gananciasPerdidasData = categoryData?.map((category) => {
      let sum:number= 0;
      const relatedExpenses = expensesData?.filter(
        
        (expense) => {
          if (expense.category_expense_id === category.category_id) {
            sum += expense.expense_amount;
            return true
          } else {
            return false
          }}
      );
      return { ...category, data: relatedExpenses, sum };
    });
  
    return { data: gananciasPerdidasData, error: categoryError || expensesError };
  }
  async getGananciasPerdidasIncomes(user_uuid: string, month?:number, year?:number) {
    const currentDate = new Date();
    const currentYear = year? year :  currentDate.getFullYear();
    const currentMonth = month? month: currentDate.getMonth() + 1;
  
    // Primero, obtenemos la información de la tabla category_expense
    const { data: categoryData, error: categoryError } = await this.supabase
      .from('budgets_incomes_view')
      .select('id,category_id, category_name, user_uuid, budget_expected')
      .eq('user_uuid', user_uuid)
      .gte('bugget_date', `${currentYear}-${currentMonth}-01`)
      .lt('bugget_date', `${currentYear}-${currentMonth + 1}-01`);

    // Luego, obtenemos la información relacionada de la tabla expenses
    const { data: incomeData, error: expensesError } = await this.supabase
      .from('income')
      .select('category_income_id, income_date, income_amount, user_uuid')
      .eq('user_uuid', user_uuid)
      .gte('income_date', `${currentYear}-${currentMonth}-01`)
      .lt('income_date', `${currentYear}-${currentMonth + 1}-01`);
  
    // Ahora combinamos los resultados usando el user_uuid como clave
    const gananciasPerdidasData = categoryData?.map((category) => {
      let sum:number= 0;
      const relatedIncome = incomeData?.filter(
        
        (income) => {
          if (income.category_income_id === category.category_id) {
            sum += income.income_amount;
            return true
          } else {
            return false
          }}
      );
      return { ...category, data: relatedIncome, sum };
    });
  
    return { data: gananciasPerdidasData, error: categoryError || expensesError };
  }
  
}
