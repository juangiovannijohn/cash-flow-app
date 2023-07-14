import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router';
import { AuthSession } from '@supabase/supabase-js'
import { sqlInjectionValidator } from 'src/app/core/helpers/sqlInjectionValidator';
import { Profile, SupabaseService } from 'src/app/core/shared/services/supabase.service';

@Component({
  selector: 'app-perfil-usuario',
  templateUrl: './perfil-usuario.component.html',
  styleUrls: ['./perfil-usuario.component.css']
})
export class PerfilUsuarioComponent implements OnInit {
  @Input()
  session: AuthSession | any = this.supabase.session ? this.supabase.session : null
  userRole:string = '';
  profile!: Profile | any;
  loading = false
  categoriesExpenses: any[] | null = []
  categoriesIncomes: any[] | null = []
  showDetails: boolean = false;
  showFormNewExpense: boolean = false;
  showFormNewIncome: boolean = false;
  categoryExpensesForm: FormGroup;
  categoryIncomeForm: FormGroup;
  updateProfileForm:FormGroup;
  showModal: boolean = false;
  showAlert:boolean = false;




  constructor(private readonly supabase: SupabaseService, private formBuilder: FormBuilder,private router: Router, private route: ActivatedRoute) {
    this.updateProfileForm = this.formBuilder.group({
      username: ['', Validators.required],
      full_name: ['', Validators.required],
      website: ['', Validators.required],
    })

    this.categoryExpensesForm = this.formBuilder.group({
      category_name: ['', [Validators.required, sqlInjectionValidator(/['";\-\-]/)]],
      category_expense_description: ['', sqlInjectionValidator(/['";\-\-]/)],
      budget_amount: [0, [Validators.min(0)]]
    });
    this.categoryIncomeForm = this.formBuilder.group({
      category_name: ['', [Validators.required, sqlInjectionValidator(/['";\-\-]/)]],
      category_income_description: ['', sqlInjectionValidator(/['";\-\-]/)]
    });
  }

  async ngOnInit(): Promise<void> {
    this.getProfile();
    this.updateProfileForm.patchValue({
      username: this.profile?.username,
      full_name: this.profile?.full_name,
      website: this.profile?.website
    });
    
  }

  async getProfile() {
    try {
      const { user } = this.session
      let { data: profile, error, status } = await this.supabase.profile(user)
      if (error && status !== 406) {
        throw error
      }
      if (profile) {
        this.userRole = profile['role'] ? profile['role'] : '';
        this.profile = profile;
        this.getCategories(this.profile.id);
        if (this.userRole != 'user') {
          console.log('se cerro sesion')
          this.supabase.signOut();
          this.router.navigate(['login']);
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message)
      }
    }
  }

  async updateProfile(): Promise<void> {
    try {
      this.loading = true
      const { user } = this.session
      const username = this.updateProfileForm.value.username as string
      const website = this.updateProfileForm.value.website as string
      const full_name = this.updateProfileForm.value.full_name as string
      const { error } = await this.supabase.updateProfile({
        id: user.id,
        username,
        website,
        full_name,
      })
      if (error) throw error
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message)
      }
    } finally {
      this.loading = false
    }
  }

  async signOut() {
    await this.supabase.signOut()
  }

  getCategories(user_uuid: string) {
    //gastos
    this.supabase.getCategoriesExpenses(user_uuid).then(resp => {
      if (resp.error) {
        console.warn(resp.error)
      } else {
        this.categoriesExpenses = resp.category_expense_view
      }
    })
    //ingresos
    this.supabase.getCategoriesIncome(user_uuid).then(resp => {
      if (resp.error) {
        console.warn(resp.error)
      } else {
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
      const user_uuid = this.profile.id
      const category_expense_description = this.categoryExpensesForm.value.category_expense_description
      const budget_amount = this.categoryExpensesForm.value.budget_amount
      this.supabase.createCategoryExpense(category_name, user_uuid, category_expense_description, budget_amount).then(
        resp => {
          if (resp.error) {
            console.warn(resp.error)
          } else {
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
      const user_uuid = this.profile.id
      const category_income_description = this.categoryIncomeForm.value.category_income_description
      this.supabase.createCategoryIncome(category_name, user_uuid, category_income_description).then(
        resp => {
          if (resp.error) {
            console.warn(resp.error)
          } else {
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
          setTimeout(() => {
            location.reload();
          }, 200)
        }
      })
    }

    //Actualizacion o creacion de presupuesto
    if (!budget_id) {
      this.supabase.createBudgetExpense(id_expense, budget_expected, this.profile.id).then(resp => {
        if (resp.error) {
          console.warn(resp.error)
        } else {
          console.log('presupuesto creado')
        }
      })
    } else {
      this.supabase.updateBudgetExpense(budget_id, budget_expected).then(resp => {
        if (resp.error) {
          console.warn(resp.error)
        } else {
          console.log('presupuesto actualizado')
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

  openModal() {
    this.showModal = true;
  }

  deleteCategory(id_category: number | string, expense_boolean:boolean) {
    if (expense_boolean) {
      this.supabase.checkCategoryExpense(id_category).then(
        resp => {
          if(resp.expenses?.length == 0){
            this.deleteCategoryExpense(id_category);
  
          }else{
            this.closeModal();
            this.openAlert();
          }
        }
      )
    } else {
      this.supabase.checkCategoryIncome(id_category).then(
        resp => {
          if(resp.incomes?.length == 0){
            this.deleteCategoryIncome(id_category);
          }else{
            this.closeModal();
            this.openAlert();
          }
        }
      )
    }
  }

  closeModal() {
    this.showModal = false;
  }
  openAlert(){
    this.showAlert = true;
  }
  closeAlert(){
    this.showAlert = false;
  }
}
