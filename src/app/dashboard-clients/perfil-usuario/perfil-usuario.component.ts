import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { AuthSession } from '@supabase/supabase-js'
import { sqlInjectionValidator } from 'src/app/core/helpers/sqlInjectionValidator';
import { Profile, SupabaseService } from 'src/app/core/shared/services/supabase.service';

@Component({
  selector: 'app-perfil-usuario',
  templateUrl: './perfil-usuario.component.html',
  styleUrls: ['./perfil-usuario.component.css']
})
export class PerfilUsuarioComponent implements OnInit {
  loading = false
  profile!: Profile
  user: any
  user_uuid: string = '8085f1c3-464a-4a01-8878-555277c367e0'
  categoriesExpenses: any[] | null = []
  categoriesIncomes: any[] | null = []
  showDetails: boolean = false;
  showFormNewExpense: boolean = false;
  showFormNewIncome: boolean = false;
  categoryExpensesForm: FormGroup;
  categoryIncomeForm: FormGroup;

  presupuesto: any= ''



  @Input()
  session!: AuthSession

  updateProfileForm = this.formBuilder.group({
    username: '',
    website: '',
    avatar_url: '',
  })

  constructor(private readonly supabase: SupabaseService, private formBuilder: FormBuilder) {
    this.categoryExpensesForm = this.formBuilder.group({
      category_name: ['', [Validators.required, sqlInjectionValidator(/['";\-\-]/)]],
      user_uuid: [this.user_uuid, [Validators.required]],
      category_expense_description: ['', sqlInjectionValidator(/['";\-\-]/)],
      budget_amount: [0, [Validators.min(0)]]
    });
    this.categoryIncomeForm = this.formBuilder.group({
      category_name: ['', [Validators.required, sqlInjectionValidator(/['";\-\-]/)]],
      user_uuid: [this.user_uuid, [Validators.required]],
      category_income_description: ['', sqlInjectionValidator(/['";\-\-]/)]
    });
  }

  async ngOnInit(): Promise<void> {
    // await this.getProfile()

    // const { username, website, avatar_url } = this.profile
    // this.updateProfileForm.patchValue({
    //   username,
    //   website,
    //   avatar_url,
    // })

    this.getCategories(this.user_uuid);
  }

  async getProfile() {
    // try {
    //   this.loading = true
    //   const { user } = this.session
    //   let { data: profile, error, status } = await this.supabase.profile(user)

    //   if (error && status !== 406) {
    //     throw error
    //   }

    //   if (profile) {
    //     this.profile = profile
    //   }
    // } catch (error) {
    //   if (error instanceof Error) {
    //     alert(error.message)
    //   }
    // } finally {
    //   this.loading = false
    // }
  }

  async updateProfile(): Promise<void> {
    // try {
    //   this.loading = true
    //   const { user } = this.session

    //   const username = this.updateProfileForm.value.username as string
    //   const website = this.updateProfileForm.value.website as string
    //   const avatar_url = this.updateProfileForm.value.avatar_url as string

    //   const { error } = await this.supabase.updateProfile({
    //     id: user.id,
    //     username,
    //     website,
    //     avatar_url,
    //   })
    //   if (error) throw error
    // } catch (error) {
    //   if (error instanceof Error) {
    //     alert(error.message)
    //   }
    // } finally {
    //   this.loading = false
    // }
  }

  async signOut() {
    // await this.supabase.signOut()
  }

  getCategories(user_uuid: string) {
    //gastos
    this.supabase.getCategoriesExpenses(user_uuid).then(resp => {
      if (resp.error) {
        console.warn(resp.error)
      } else {
        console.log(resp.category_expense_view)
        this.categoriesExpenses = resp.category_expense_view
      }
    })
    //ingresos
    this.supabase.getCategoriesIncome(user_uuid).then(resp => {
      if (resp.error) {
        console.warn(resp.error)

      } else {
        console.log(resp.category_income)
        this.categoriesIncomes = resp.category_income
      }
    })
  }
  createCategoryExpense() {
    if (!this.categoryExpensesForm.valid) {
      alert('Campos inválidos');
      setTimeout(() => {
        location.reload();
      }, 200)
      return
    } else {
      const category_name = this.categoryExpensesForm.value.category_name
      const user_uuid = this.categoryExpensesForm.value.user_uuid
      const category_expense_description = this.categoryExpensesForm.value.category_expense_description
      const budget_amount = this.categoryExpensesForm.value.budget_amount
      this.supabase.createCategoryExpense(category_name, user_uuid, category_expense_description, budget_amount).then(
        resp => {
          if (resp.error) {
            console.warn(resp.error)
          } else {
            console.log(resp.data)
            setTimeout(() => {
              location.reload();
            }, 200)
          }
        }
      )
    }
  }

  createCategoryIncome() {
    if (!this.categoryIncomeForm.valid) {
      alert('Campos inválidos');
      setTimeout(() => {
        location.reload();
      }, 200)
      return
    } else {
      const category_name = this.categoryIncomeForm.value.category_name
      const user_uuid = this.categoryIncomeForm.value.user_uuid
      const category_income_description = this.categoryIncomeForm.value.category_income_description
      this.supabase.createCategoryIncome(category_name, user_uuid, category_income_description).then(
        resp => {
          if (resp.error) {
            console.warn(resp.error)

          } else {
            console.log(resp.data)
            setTimeout(() => {
              location.reload();
            }, 200)
          }
        }
      )
    }
  }
  updateCategoryExpense(id_expense: string | number, category_name: string, category_expense_description: string, budget_expected: number, budget_id: number | string) {
    if (!category_name) {
      alert('El nombre de la categoria es obligatorio');
      setTimeout(() => {
        location.reload();
      }, 200)
      return
    } else {
      this.supabase.updateCategoryExpense(id_expense, category_name, category_expense_description).then(resp => {
        if (resp.error) {
          console.warn(resp.error)
        } else {
          console.log(resp.data)
          // setTimeout(() => {
          //   location.reload();
          // }, 200)
        }
      })
    }

    //Actualizacion o creacion de presupuesto
      if (!budget_id) {
       this.supabase.createBudgetExpense(id_expense, budget_expected, this.user_uuid).then(resp=>{
        if (resp.error) {
          console.warn(resp.error)
        }else{
          console.log('presupuesto creado',resp.budgets)
        }
      })
      } else {
        this.supabase.updateBudgetExpense(budget_id, budget_expected).then(resp=>{
          if (resp.error) {
            console.warn(resp.error)
          }else{
            console.log('presupuesto actualizado',resp.budgets)
          }
        })
      }


  }

  updateCategoryIncome(id_income: string | number, category_name: string, category_income_description: string) {
    if (!category_name) {
      alert('El nombre de la categoria es obligatorio');
      setTimeout(() => {
        location.reload();
      }, 200)
      return
    } else {
      this.supabase.updateCategoryIncome(id_income, category_name, category_income_description).then(resp => {

        if (resp.error) {
          console.warn(resp.error)
        } else {
          console.log(resp.data)
          setTimeout(() => {
            location.reload();
          }, 200)
        }
      })
    }
  }

  deleteCategoryExpense(id_expense: string | number) {
    this.supabase.deleteCategoryExpense(id_expense).then(resp => {
      if (!id_expense) {
        alert('Error, intente nuevamente');
        setTimeout(() => {
          location.reload();
        }, 200)
        return
      } else {
        if (resp.error) {
          console.warn(resp.error)
        } else {
          setTimeout(() => {
            location.reload();
          }, 200)
        }
      }
    })
  }

  deleteCategoryIncome(id_income: string | number) {
    this.supabase.deleteCategoryIncome(id_income).then(resp => {
      if (!id_income) {
        alert('Error, intente nuevamente');
        setTimeout(() => {
          location.reload();
        }, 200)
        return
      } else {
        if (resp.error) {
          console.warn(resp.error)
        } else {
          setTimeout(() => {
            location.reload();
          }, 200)
        }
      }
    })
  }

    presupuestoFunc(){

  }
}
