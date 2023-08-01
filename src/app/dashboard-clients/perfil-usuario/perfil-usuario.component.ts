import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router';
import { AuthSession } from '@supabase/supabase-js'
import { sqlInjectionValidator } from 'src/app/core/helpers/sqlInjectionValidator';
import { UserRoles } from 'src/app/core/models-interface/enums';
import { Profile, SupabaseService } from 'src/app/core/shared/services/supabase.service';

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
  // showDetails: boolean = false;
  showFormNewExpense: boolean = false;
  showFormNewIncome: boolean = false;
  categoryExpensesForm: FormGroup;
  categoryIncomeForm: FormGroup;
  updateProfileForm: FormGroup;
  showModal: boolean = false;
  showAlert: boolean = false;
  classesModal: string = '';
  messageModal: string = '';
  totalBudgetExpenses:number = 0

  constructor(private readonly supabase: SupabaseService, private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute) {
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
    this.user = await this.supabase.getUser();
    this.getProfile(this.user);
    this.updateProfileForm.patchValue({
      username: this.user?.username,
      full_name: this.user?.full_name,
      website: this.user?.website
    });

  }

  async getProfile(user: any) {
    try {
      const role = user && user.user_metadata['role'] ? user.user_metadata['role'] : user.user_meta.role;
      if (role == UserRoles.Normal || role == UserRoles.Premium) {
        this.getCategories(user.id);
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

  getCategories(user_uuid: string) {
    //gastos
    this.supabase.getCategoriesExpenses(user_uuid).then(resp => {
      if (resp.error) {
        console.warn(resp.error)
      } else {
        this.categoriesExpenses = resp.category_expense_view;
        let budgetAmount = 0
        const amount = resp.category_expense_view?.map(item=>{
          budgetAmount += item['budget_expected'] ? item['budget_expected'] : 0
        });
        this.totalBudgetExpenses = budgetAmount
      }
    })
    //ingresos
    this.supabase.getCategoriesIncome(user_uuid).then(resp => {
      if (resp.error) {
        console.warn(resp.error)
      } else {
        this.categoriesIncomes = resp.category_income;
      }
    })
  }
  createCategoryExpense() {
    if (!this.categoryExpensesForm.valid) {
      this.openAlert('text-red', 'Campos inválidos');
      this.categoryExpensesForm.reset();
      return
    } else {
      const category_name = this.categoryExpensesForm.value.category_name
      const user_uuid = this.user.id
      const category_expense_description = this.categoryExpensesForm.value.category_expense_description
      const budget_amount = this.categoryExpensesForm.value.budget_amount
      this.supabase.createCategoryExpense(category_name, user_uuid, category_expense_description, budget_amount).then(
        resp => {
          if (resp.error) {
            this.openAlert('text-red', 'Ha ocurrido algun error al crear la categoría, intente nuevamente.');
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
      this.openAlert('text-red', 'Campos inválidos');
      this.categoryExpensesForm.reset();
      return
    } else {
      const category_name = this.categoryIncomeForm.value.category_name
      const user_uuid = this.user.id
      const category_income_description = this.categoryIncomeForm.value.category_income_description
      this.supabase.createCategoryIncome(category_name, user_uuid, category_income_description).then(
        resp => {
          if (resp.error) {
            this.openAlert('text-red', 'Ha ocurrido algun error al crear la categoría, intente nuevamente.');
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
      this.openAlert('text-red', 'El nombre de la categoria es obligatorio');
      return
    } else {
      this.supabase.updateCategoryExpense(id_expense, category_name, category_expense_description).then(resp => {
        if (resp.error) {
          this.openAlert('text-red', 'Ha ocurrido algun error al actualizar la categoría, intente nuevamente.');
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
      this.supabase.createBudgetExpense(id_expense, budget_expected, this.user.id).then(resp => {
        if (resp.error) {
          this.openAlert('text-red', 'Ha ocurrido algun error al crear el valor del presupuesto, intente nuevamente.');
          console.warn(resp.error)
        } else {
          console.log('presupuesto creado')
        }
      })
    } else {
      this.supabase.updateBudgetExpense(budget_id, budget_expected).then(resp => {
        if (resp.error) {
          this.openAlert('text-red', 'Ha ocurrido algun error al actualizar el valor del presupuesto, intente nuevamente.');
          console.warn(resp.error)
        } else {
          console.log('presupuesto actualizado')
        }
      })
    }


  }

  updateCategoryIncome(id_income: string | number, category_name: string, category_income_description: string) {
    if (!category_name) {
      this.openAlert('text-red', 'El nombre de la categoria es obligatorio');
      return
    } else {
      this.supabase.updateCategoryIncome(id_income, category_name, category_income_description).then(resp => {

        if (resp.error) {
          this.openAlert('text-red', 'Ha ocurrido algun error al actualizar la categoría, intente nuevamente.');
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
    if (!id_expense) {
      this.openAlert('text-red', 'Error, intente nuevamente.');
      return
    } else {
      this.supabase.deleteCategoryExpense(id_expense).then(resp => {

        if (resp.error) {
          this.openAlert('text-red', 'Ha ocurrido algun error al eliminar la categoría, intente nuevamente.');
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

  deleteCategoryIncome(id_income: string | number) {
    if (!id_income) {
      this.openAlert('text-red', 'Error, intente nuevamente.');
      return
    } else {
      this.supabase.deleteCategoryIncome(id_income).then(resp => {

        if (resp.error) {
          this.openAlert('text-red', 'Ha ocurrido algun error al eliminar la categoría, intente nuevamente.');
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

  openModal() {
    this.showModal = true;
  }

  deleteCategory(id_category: number | string, expense_boolean: boolean) {
    if (expense_boolean) {
      this.supabase.checkCategoryExpense(id_category).then(
        resp => {
          if (resp.expenses?.length == 0) {
            this.deleteCategoryExpense(id_category);

          } else {
            this.closeModal();
            this.openAlert('text-red', 'No puede eliminar una categoría que tiene gastos registrados.');
          }
        }
      )
    } else {
      this.supabase.checkCategoryIncome(id_category).then(
        resp => {
          if (resp.incomes?.length == 0) {
            this.deleteCategoryIncome(id_category);
          } else {
            this.closeModal();
            this.openAlert('text-red', 'No puede eliminar una categoría que tiene gastos o ingresos registrados.');
          }
        }
      )
    }
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
}
