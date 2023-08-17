import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router';
import { UserRoles } from 'src/app/core/models-interface/enums';
import { SupabaseService } from 'src/app/core/shared/services/supabase.service';

@Component({
  selector: 'app-perfil-usuario',
  templateUrl: './perfil-usuario.component.html',
  styleUrls: ['./perfil-usuario.component.css']
})
export class PerfilUsuarioComponent implements OnInit {
  @Input()
  user: any;
  loading = false
  categoriesExpenses: any[] | null = []
  categoriesIncomes: any[] | null = []
  categoriesExpensesNonBudgeted : any[] = []
  categoriesIncomesNonBudgeted : any[] = []
  showFormNewExpense: boolean = false;
  showFormNewIncome: boolean = false;
  budgetExpensesForm: FormGroup;
  budgetIncomeForm: FormGroup;
  updateProfileForm: FormGroup;
  showModal: boolean = false;
  showAlert: boolean = false;
  classesModal: string = '';
  messageModal: string = '';
  totalBudgetExpenses:number = 0;
  totalBudgetIncomes:number = 0;
  currentMonth: number = 0;
  currentYear: number = 0;

  //Oldbudgets
  titleOldBudgets: string = 'Presupuestos anteriores'


  constructor(private readonly supabase: SupabaseService, private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute) {
    this.updateProfileForm = this.formBuilder.group({
      username: ['', Validators.required],
      full_name: ['', Validators.required],
      website: ['', Validators.required],
    })

    this.budgetExpensesForm = this.formBuilder.group({
      budget_expected: ['', [Validators.required,Validators.min(0)]],
      category_id:  ['', Validators.required],
      // month: ['', [Validators.required, Validators.max(12), Validators.min(1), Validators.minLength(1), Validators.maxLength(2)]],
      // year: ['', [Validators.required, Validators.max(9999), Validators.min(2020), Validators.minLength(4), Validators.maxLength(4)]]
    });
    this.budgetIncomeForm = this.formBuilder.group({
      budget_expected: ['', [Validators.required,Validators.min(0)]],
      category_id:  ['', Validators.required],
      // month: ['', [Validators.required, Validators.max(12), Validators.min(1), Validators.minLength(1), Validators.maxLength(2)]],
      // year: ['', [Validators.required, Validators.max(9999), Validators.min(2020), Validators.minLength(4), Validators.maxLength(4)]]
    });
  }

  async ngOnInit(): Promise<void> {
    const currentDate = new Date();
    this.currentYear =  currentDate.getFullYear();
    this.currentMonth = currentDate.getMonth() + 1;
    this.user = await this.supabase.getUser();
    this.getProfile(this.user, this.currentYear,this.currentMonth );
    this.updateProfileForm.patchValue({
      username: this.user?.username,
      full_name: this.user?.full_name,
      website: this.user?.website
    });

  }

  async getProfile(user: any, currentYear?:number, currentMonth?:number) {
    try {
      const role = user && user.user_metadata['role'] ? user.user_metadata['role'] : user.user_meta.role;
      if (role == UserRoles.Normal || role == UserRoles.Premium) {
        this.getCategories(user.id, currentYear, currentMonth);
      } else {
        console.log('se cerro sesion')
        this.supabase.signOut();
        this.router.navigate(['login']);
      }
    } catch (error) {
      console.log(error)
      if (error instanceof Error) {
        this.openAlert('text-red', `${error.message}`);
      }
    }
  }

  async updateProfile(): Promise<void> {
    try {
      this.loading = true
      const username = this.updateProfileForm.value.username as string
      const website = this.updateProfileForm.value.website as string
      const full_name = this.updateProfileForm.value.full_name as string
      const { error } = await this.supabase.updateProfile({
        id: this.user.id,
        username,
        website,
        full_name,
      })
      if (error) throw error
    } catch (error) {
      console.log(error)
      if (error instanceof Error) {
        this.openAlert('text-red', `${error.message}`);
      }
    } finally {
      this.loading = false
    }
  }

  async getCategories(user_uuid: string, year?:number, month?:number) {
    //gastos
    this.supabase.getCategoriesExpenses(user_uuid, year, month).then(resp => {
      if (resp.error) {
        console.warn(resp.error)
      } else {
        this.categoriesExpenses = resp.category_expense_view;
        this.getCategoriesExpensesNonBudgeted(resp.category_expense_view);
        let budgetAmount = 0
        const categoriesOrdered = resp.category_expense_view?.map(item=>{
          budgetAmount += item['budget_expected'] ? item['budget_expected'] : 0
        });
        this.totalBudgetExpenses = budgetAmount
      }
    })
    //ingresos
    this.supabase.getCategoriesIncome(user_uuid, year, month).then(resp => {
      if (resp.error) {
        console.warn(resp.error)
      } else {
        this.categoriesIncomes = resp.category_income;
        this.getCategoriesIncomesNonBudgeted(resp.category_income);
        let budgetAmount = 0
        const categoriesOrdered = resp.category_income?.map(item=>{
          budgetAmount += item['budget_expected'] ? item['budget_expected'] : 0
        });
        this.totalBudgetIncomes = budgetAmount
      }
    })
    
  }

  getCategoriesOldExpenses(year:number, month:number){
    this.currentMonth= month;
    this.currentYear = year;
    this.getCategories(this.user.id, year, month);
  }

  //Metodo que filtra las categorias no presupuestadas.
 async getCategoriesExpensesNonBudgeted(categoriesExpenses: any[] | null,categoriesIncomes?:any[],  year?:number, month?:number){
    const allCategoriesExpenses = await this.supabase.getAllCategoriesExpensesByUser(this.user.id).then( resp => !resp.error? resp.category_expenses : [])
    const expenses = allCategoriesExpenses && categoriesExpenses ? allCategoriesExpenses.filter(objA => {
      return !categoriesExpenses.some(objB => objB.id == objA.id);
    }): [];
    this.categoriesExpensesNonBudgeted = expenses
  }
    //Metodo que filtra las categorias no presupuestadas.
 async getCategoriesIncomesNonBudgeted(categoriesIncomes: any[] | null,  year?:number, month?:number){
  const allCategoriesIncomes = await this.supabase.getAllCategoriesIncomesByUser(this.user.id).then( resp => !resp.error? resp.category_incomes : [])
  const incomes = allCategoriesIncomes && categoriesIncomes ? allCategoriesIncomes.filter(objA => {
    return !categoriesIncomes.some(objB => objB.id == objA.id);
  }): [];
  this.categoriesIncomesNonBudgeted = incomes
}
  //CREATE
  createBudgetExpense( ){
    if (this.budgetExpensesForm.valid) {
      const formData = {
        category_id: this.budgetExpensesForm.value.category_id,
        budget_expected: this.budgetExpensesForm.value.budget_expected,
        user_uuid: this.user.id,
        // month: this.budgetExpensesForm.value.month,
        // year: this.budgetExpensesForm.value.year,
      }
      this.supabase.createBudgetExpense(formData).then(resp =>{
        if(resp.error){
          this.openAlert('text-red', `Ha ocurrido algún error al crear el presupuesto. ${resp.error.message}`);
        }else{
          this.getCategories(this.user.id, this.currentYear, this.currentMonth);
          this.showFormNewExpense= false
        }
      })
      .catch(err =>{ 
        this.openAlert('text-red', `Ha ocurrido algún error al crear el presupuesto. ${err.message}`);
        console.log(err)})
    
    }else{
      this.openAlert('text-red', `Los campos del formulario son incorrectos.`);
    }
  }
  createBudgetIncome(){
    if (this.budgetIncomeForm.valid) {
      const formData = {
        category_id: this.budgetIncomeForm.value.category_id,
        budget_expected: this.budgetIncomeForm.value.budget_expected,
        user_uuid: this.user.id,
        // month: this.budgetIncomeForm.value.month,
        // year: this.budgetIncomeForm.value.year,
      }
    this.supabase.createBudgetIncome(formData).then(resp =>{
      if(resp.error){
        this.openAlert('text-red', `Ha ocurrido algún error al crear el presupuesto. ${resp.error.message}`);
      }else{
        this.getCategories(this.user.id, this.currentYear, this.currentMonth);
      }
    })
    .catch(err =>{ 
      this.openAlert('text-red', `Ha ocurrido algún error al crear el presupuesto. ${err.message}`);
      console.log(err)})
  }else{
    this.openAlert('text-red', `Los campos del formulario son incorrectos.`);
  }
  }
  
  //UPDATE
  updateBudgetExpense(budget_id: string | number, budget_expected: number) {

      this.supabase.updateBudgetExpense(budget_id, budget_expected).then(resp => {
        if (resp.error) {
          this.openAlert('text-red',`Ha ocurrido algún error al actualizar el valor del presupuesto, intente nuevamente. ${resp.error.message}`);
          console.warn(resp.error)
        } else {
          this.getCategories(this.user.id, this.currentYear, this.currentMonth);
        }
      })
      .catch(err =>{ 
        this.openAlert('text-red', `Ha ocurrido algún error al crear el presupuesto. ${err.message}`);
        console.log(err)})
  }

  updateBudgetIncome(budget_id: string | number, budget_expected: number) {
      this.supabase.updateBudgetIncome(budget_id, budget_expected).then(resp => {
        if (resp.error) {
          this.openAlert('text-red', `Ha ocurrido algún error al actualizar el valor del presupuesto, intente nuevamente. ${resp.error.message}`);
          console.warn(resp.error)
        } else {
          this.getCategories(this.user.id, this.currentYear, this.currentMonth);
        }
      })
      .catch(err =>{ 
        this.openAlert('text-red', `Ha ocurrido algún error al crear el presupuesto. ${err.message}`);
        console.log(err)})
    }

// DELETE
  deleteBudgetExpense(budget_id: string | number) {
    if (!budget_id) {
      this.openAlert('text-red', 'Error, intente nuevamente.');
      return
    } else {
      this.supabase.deleteBudgetExpense(budget_id).then(error => {
        if (error) {
          this.openAlert('text-red', `Ha ocurrido algún error al eliminar la categoría, intente nuevamente. ${error.message}`);
          console.warn(error)
        } else {
            this.getCategories(this.user.id, this.currentYear, this.currentMonth);
        }
      }
      )
    }
  }

  deleteBudgetIncome(budget_id: string | number) {
    if (!budget_id) {
      this.openAlert('text-red', 'Error, intente nuevamente.');
      return
    } else {
      this.supabase.deleteBudgetIncome(budget_id).then(error => {
        if (error) {
          this.openAlert('text-red', `Ha ocurrido algún error al eliminar la categoría, intente nuevamente. ${error.message}`);
          console.warn(error)
        } else {
            this.getCategories(this.user.id, this.currentYear, this.currentMonth);
        }
      }
      )
    }
  }
  deleteCategory(budget_id: number | string, expense_boolean: boolean) {
    if (expense_boolean) {
            this.deleteBudgetExpense(budget_id);
    } else {
            this.deleteBudgetIncome(budget_id);
    }
  }
  crearMucho(){
    this.supabase.createManyBudgetsIncomes().then(resp=> {
    })
    .catch(error => console.log(error))
  }
  openModal() {
    this.showModal = true;
  }
  closeModal() {
    this.showModal = false;
  }
  openAlert(className: string, message: string) {
    this.messageModal = message;
    this.classesModal = className;
    this.showAlert = true;
  }
  closeAlert() {
    this.messageModal = '';
    this.classesModal = '';
    this.showAlert = false;
  }
  reloadWindow(time: number) {
    setTimeout(() => {
      location.reload();
    }, time);
  }
}
