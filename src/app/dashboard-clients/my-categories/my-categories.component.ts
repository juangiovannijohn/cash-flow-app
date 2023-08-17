import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  destroyPlatform,
} from '@angular/core';
import { SupabaseService } from 'src/app/core/shared/services/supabase.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { sqlInjectionValidator } from 'src/app/core/helpers/sqlInjectionValidator';
@Component({
  selector: 'app-my-categories',
  templateUrl: './my-categories.component.html',
  styleUrls: ['./my-categories.component.css'],
})
export class MyCategoriesComponent implements OnInit {
  user: any;
  categoryExpensesForm: FormGroup;
  categoryIncomeForm: FormGroup;
  categoriesExpenses: any[] | null = [];
  categoriesIncomes: any[] | null = [];
  showFormNewExpense: boolean = false;
  showFormNewIncome: boolean = false;
  selectedCatId: number = 0;
  selectedCatName: string = '';
  selectedCatDescription: string = '';

  showModal: boolean = false;
  showAlert: boolean = false;
  classesModal: string = '';
  messageModal: string = '';
  rowTitle: boolean = false;
  showFormEditExpense: boolean = false;
  showFormEditIncome: boolean = false;

  constructor(
    private readonly supabase: SupabaseService,
    private formBuilder: FormBuilder,
  ) {
    this.categoryExpensesForm = this.formBuilder.group({
      category_name: [
        '',
        [Validators.required, sqlInjectionValidator(/['";\-\-]/)],
      ],
      category_expense_description: ['', sqlInjectionValidator(/['";\-\-]/)],
    });
    this.categoryIncomeForm = this.formBuilder.group({
      category_name: [
        '',
        [Validators.required, sqlInjectionValidator(/['";\-\-]/)],
      ],
      category_income_description: ['', sqlInjectionValidator(/['";\-\-]/)],
    });
  }

  async ngOnInit(): Promise<void> {
    this.user = await this.supabase.getUser();
    this.getCategories(this.user.id);
  }
  getCategories(user_uuid: string, year?: number, month?: number) {
    //gastos
    this.supabase.getAllCategoriesExpensesByUser(user_uuid).then((resp) => {
      if (resp.error) {
        console.warn(resp.error);
      } else {
        this.categoriesExpenses = resp.category_expenses;
      }
    });
    //ingresos
    this.supabase.getAllCategoriesIncomesByUser(user_uuid).then((resp) => {
      if (resp.error) {
        console.warn(resp.error);
      } else {
        this.categoriesIncomes = resp.category_incomes;
      }
    });
  }
  createCategoryExpense() {
    if (!this.categoryExpensesForm.valid) {
      this.openAlert('text-red', 'Campos inválidos');
      this.categoryExpensesForm.reset();
      return;
    } else {
      const category_name = this.categoryExpensesForm.value.category_name;
      const user_uuid = this.user.id;
      const category_expense_description =
        this.categoryExpensesForm.value.category_expense_description;
      this.supabase
        .createCategoryExpense(
          category_name,
          user_uuid,
          category_expense_description,
        )
        .then((resp) => {
          if (resp.error) {
            this.openAlert(
              'text-red',
              'Ha ocurrido algun error al crear la categoría, intente nuevamente.',
            );
            console.warn(resp.error);
          } else {
            console.log(resp.data);
            // this.getCategories(this.user.id);
            this.reloadWindow(200);
            this.showFormNewExpense = false;
          }
        });
    }
  }

  createCategoryIncome() {
    if (!this.categoryIncomeForm.valid) {
      this.openAlert('text-red', 'Campos inválidos');
      this.categoryExpensesForm.reset();
      return;
    } else {
      const category_name = this.categoryIncomeForm.value.category_name;
      const user_uuid = this.user.id;
      const category_income_description =
        this.categoryIncomeForm.value.category_income_description;
      this.supabase
        .createCategoryIncome(
          category_name,
          user_uuid,
          category_income_description,
        )
        .then((resp) => {
          if (resp.error) {
            this.openAlert(
              'text-red',
              'Ha ocurrido algun error al crear la categoría, intente nuevamente.',
            );
            console.warn(resp.error);
          } else {
            console.log(resp.data);
            // this.getCategories(this.user.id);
            this.reloadWindow(200);
            this.showFormNewIncome = false;
          }
        });
    }
  }
  updateCategoryExpense(
    id_expense: string | number,
    category_name: string,
    category_expense_description: string,
  ) {
    if (!category_name) {
      this.openAlert('text-red', 'El nombre de la categoría es obligatorio');
      return;
    } else {
      this.supabase
        .updateCategoryExpense(
          id_expense,
          category_name,
          category_expense_description,
        )
        .then((resp) => {
          if (resp.error) {
            this.openAlert(
              'text-red',
              'Ha ocurrido algún error al actualizar la categoría, intente nuevamente.',
            );
            console.warn(resp.error);
          } else {
            console.log(resp.data);
            // this.getCategories(this.user.id);
            this.reloadWindow(200);
            this.showFormEditExpense = false;
          }
        });
    }
  }

  updateCategoryIncome(
    id_income: string | number,
    category_name: string,
    category_income_description: string,
  ) {
    if (!category_name) {
      // this.openAlert('text-red', 'El nombre de la categoria es obligatorio');
      return;
    } else {
      this.supabase
        .updateCategoryIncome(
          id_income,
          category_name,
          category_income_description,
        )
        .then((resp) => {
          if (resp.error) {
            // this.openAlert('text-red', 'Ha ocurrido algun error al actualizar la categoría, intente nuevamente.');
            console.warn(resp.error);
          } else {
            console.log(resp.data);
            // this.getCategories(this.user.id);
            this.reloadWindow(200);
            this.showFormEditIncome = false;
          }
        });
    }
  }

  deleteCategoryExpense(id_expense: string | number) {
    if (!id_expense) {
      this.openAlert('text-red', 'Error, intente nuevamente.');
      return;
    } else {
      this.supabase.deleteCategoryExpense(id_expense).then((resp) => {
        if (resp.error) {
          this.openAlert(
            'text-red',
            'Ha ocurrido algun error al eliminar la categoría, intente nuevamente.',
          );
          console.warn(resp.error);
        } else {
          this.closeModal();
          // this.getCategories(this.user.id);
          this.reloadWindow(200);
        }
      });
    }
  }

  deleteCategoryIncome(id_income: string | number) {
    if (!id_income) {
      this.openAlert('text-red', 'Error, intente nuevamente.');
      return;
    } else {
      this.supabase.deleteCategoryIncome(id_income).then((resp) => {
        if (resp.error) {
          this.openAlert(
            'text-red',
            'Ha ocurrido algun error al eliminar la categoría, intente nuevamente.',
          );
          console.warn(resp.error);
        } else {
          this.closeModal();
          // this.getCategories(this.user.id);
          this.reloadWindow(200);
        }
      });
    }
  }
  deleteCategory(id_category: number | string, expense_boolean: boolean) {
    if (expense_boolean) {
      this.supabase.checkCategoryExpense(id_category).then((resp) => {
        if (resp.expenses?.length == 0) {
          this.deleteCategoryExpense(id_category);
        } else {
          this.closeModal();
          this.openAlert(
            'text-red',
            'No puede eliminar una categoría que tiene gastos registrados.',
          );
        }
      });
    } else {
      this.supabase.checkCategoryIncome(id_category).then((resp) => {
        if (resp.incomes?.length == 0) {
          this.deleteCategoryIncome(id_category);
        } else {
          this.closeModal();
          this.openAlert(
            'text-red',
            'No puede eliminar una categoría que tiene gastos o ingresos registrados.',
          );
        }
      });
    }
  }
  selectCategory(
    id: number,
    name: string,
    description: string,
    isExpense: boolean,
  ) {
    if (isExpense) {
      this.showFormEditIncome = false;
      if (this.selectedCatId == id)
        this.showFormEditExpense = !this.showFormEditExpense;
    } else {
      this.showFormEditExpense = false;
      if (this.selectedCatId == id)
        this.showFormEditIncome = !this.showFormEditIncome;
    }
    this.selectedCatId = id;
    this.selectedCatName = name;
    this.selectedCatDescription = description;
  }
  reloadWindow(time: number) {
    setTimeout(() => {
      location.reload();
    }, time);
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
}
