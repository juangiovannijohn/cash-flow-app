import { Injectable } from '@angular/core'
import {
  AuthChangeEvent,
  AuthSession,
  createClient,
  Session,
  SupabaseClient,
  User,
} from '@supabase/supabase-js'
import { environment } from 'src/environments/environment'
import { BudgetAlertClass, BudgetPercentage, CategoryType } from '../../models-interface/enums'
import { TransactionsDetails } from '../../models-interface/interfaces'
import { throwError } from 'rxjs'

export interface Profile {
  id?: string
  username: string
  website: string
  avatar_url: string
}

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient
  _session: AuthSession | null = null

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey)
  }

  // AUTH
  get session() {
    this.supabase.auth.getSession().then(({ data }) => {
      this._session = data.session
    })
    return this._session
  }

  profile(user: User) {
    return this.supabase
      .from('profiles')
      .select(`username, website, avatar_url`)
      .eq('id', user.id)
      .single()
  }

  authChanges(callback: (event: AuthChangeEvent, session: Session | null) => void) {
    return this.supabase.auth.onAuthStateChange(callback)
  }

  signIn(email: string) {
    return this.supabase.auth.signInWithOtp({ email })
  }

  signOut() {
    return this.supabase.auth.signOut()
  }

  updateProfile(profile: Profile) {
    const update = {
      ...profile,
      updated_at: new Date(),
    }

    return this.supabase.from('profiles').upsert(update)
  }

  downLoadImage(path: string) {
    return this.supabase.storage.from('avatars').download(path)
  }

  uploadAvatar(filePath: string, file: File) {
    return this.supabase.storage.from('avatars').upload(filePath, file)
  }

  //  TRANSACTIONS
  async getCategoriesExpenses(user_uuid: string) {

    let { data: category_expense_view, error } = await this.supabase
      .from('category_expense_view')
      .select('*')
      .eq('user_uuid', user_uuid)
      .order('category_name', { ascending: true })

    return { category_expense_view, error };

  }
  async getCategoriesIncome(user_uuid: string) {

    let { data: category_income, error } = await this.supabase
      .from('category_income')
      .select('*')
      .eq('user_uuid', user_uuid)
      .order('category_name', { ascending: true })
    return { category_income, error };
  }

  async insertNewExpense(formData: {
    expense_date: string,
    description_expense: string,
    category_expense_id: number | string,
    expense_amount: number,
    user_uuid: string
  }) {

    const { data, error } = await this.supabase
      .from('expenses')
      .insert([
        formData
      ])
    return { data, error };
  }
  async insertNewIncome(formData: {
    income_date: string,
    description_income: string,
    category_income_id: number | string,
    income_amount: number,
    user_uuid: string
  }) {

    const { data, error } = await this.supabase
      .from('income')
      .insert([
        formData
      ])
    return { data, error };
  }

  //BALANCE
  async getTransactions() {

    const { data: transactions_details, error } = await this.supabase
      .from('transactions_details')
      .select('*')
      .eq('user_uuid', '8085f1c3-464a-4a01-8878-555277c367e0');

    //Refactorizacion de info
    const transactions = transactions_details?.map((item: any) => {
      if (item.transaction_type == CategoryType.Expense) {
        item.amount = item.expense_amount * -1;
      } else if (item.transaction_type == CategoryType.Income) {
        item.amount = item.income_amount;
      }
      else {
        item.amount = 0;
      }
      return item;

    })
    return { transactions, error };
  }
  async getBudgets(user_uuid: string) {

    const { data: budgets_view, error } = await this.supabase
      .from('budgets_view')
      .select('*')
      .eq('user_uuid', user_uuid);

    const busgets = budgets_view?.map((item: any) => {
      item.class = BudgetAlertClass.Normal;

      let porcentaje = item.budget_sum / item.budget_expected * 100
      console.log('porcentaje', porcentaje);
      if (porcentaje > BudgetPercentage.Danger) {
        item.class = BudgetAlertClass.Danger
      } else if (porcentaje > BudgetPercentage.Warning) {
        item.class = BudgetAlertClass.Warning
      }
      return item
    })

    return { budgets_view, error };
  }

  //CATEGORIES
  async updateCategoryExpense(id_expense: string | number, category_name: string, category_expense_description: string) {

    const { data: category_updated, error } = await this.supabase
      .from('category_expense')
      .update({
        category_name,
        category_expense_description
      })
      .eq('id', id_expense)
      .select()
    const data = category_updated?.map((item: any) => { item.showDetails = false; return item })

    return { data, error }
  }
  async updateCategoryIncome(id_income: string | number, category_name: string, category_income_description: string) {

    const { data: category_updated, error } = await this.supabase
      .from('category_income')
      .update({
        category_name,
        category_income_description
      })
      .eq('id', id_income)
      .select()
    const data = category_updated?.map((item: any) => { item.showDetails = false; return item })

    return { data, error }
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
        .eq('id', id_expense)

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
        throw new Error('id_income debe ser una cadena de texto o un número');
      }

      const { error } = await this.supabase
        .from('category_income')
        .delete()
        .eq('id', id_income)

      if (error) {
        throw new Error('Error al eliminar la categoría de ingreso');
      }

      return { error: null };
    } catch (error: any) {
      // Manejar el error y retornar el mensaje
      return { error: error.message };
    }
  }
  async createCategoryExpense(category_name: string, user_uuid: string, category_expense_description: string, budget_amount?: number) {
    let budget_id;
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
            category_expense_description
          },
        ])
        .select()
      if (error) {
        console.log(error)
        throw new Error('Error al crear la categoria');
      }

      budget_id = data[0]['id']
      //Si se crea la categoria correctamente y se agrega un monto al budget
      if (budget_amount && budget_amount > 0) {
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = 1;
        const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;// Formatea los componentes de la fecha en el formato deseado

        const { data, error } = await this.supabase
          .from('budgets')
          .insert([
            {
              budget_date: formattedDate,
              category_id: budget_id,
              budget_expected: budget_amount,
              user_uuid
            },
          ])
          .select()
        if (error) {
          console.log(error)
          throw new Error('Error al crear el presupuesto de la categoría');
        }
      }
      return { data }
    } catch (error: any) {
      // Manejar el error y retornar el mensaje
      return { error: error.message };
    }
  }

  async createCategoryIncome(category_name: string, user_uuid: string, category_income_description: string) {
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
            category_income_description
          },
        ])
        .select()
      if (error) {
        throw new Error('Error al crear la categoria');
      }
      return { data, error }
    } catch (error: any) {
      // Manejar el error y retornar el mensaje
      return { error: error.message };
    }
  }

  async updateBudgetExpense(id_budget: string | number, budget_expected: number) {

    try {
      if (!id_budget || !budget_expected) {
        throw new Error('Los parametros son obligatorios');
      }
      const { data: budgets, error } = await this.supabase
        .from('budgets')
        .update({ budget_expected })
        .eq('id', id_budget)
        .select('*')

      if (error) {
        throw new Error('Error al actualizar el presupuesto');
      }

      return { budgets, error }

    } catch (error: any) {
      console.log(error)
      return { error: error.message };
    }

  }
  async createBudgetExpense(category_id: string | number, budget_expected: number, user_uuid:string) {

    try {
      if (!category_id || !user_uuid) {
        throw new Error('Los parametros son obligatorios');
      }
      const date = new Date();
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = 1;
      const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;// Formatea los componentes de la fecha en el formato deseado

      const { data: budgets, error } = await this.supabase
        .from('budgets')
        .insert([
          { 
            budget_date: formattedDate, 
            category_id,
            budget_expected,
            user_uuid
          },
        ])
        .select('*')

      if (error) {
        throw new Error('Error al crear el presupuesto');
      }

      return { budgets, error }

    } catch (error: any) {
      console.log(error)
      return { error: error.message };
    }

  }

}