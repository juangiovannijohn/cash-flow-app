import { Component, OnInit } from '@angular/core';
import { TransactionHistory, TransactionsDetails } from 'src/app/core/models-interface/interfaces';
import { Profile, SupabaseService } from 'src/app/core/shared/services/supabase.service';
import { CategoryType, UserRoles } from 'src/app/core/models-interface/enums';
import { AuthSession } from '@supabase/supabase-js';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-saldo-wallet',
  templateUrl: './saldo-wallet.component.html',
  styleUrls: ['./saldo-wallet.component.css'],
})
export class SaldoWalletComponent implements OnInit {
  isPremium:boolean = false;
  user: any;
  transactionsHistory: TransactionHistory[] = [];
  budgets: any[] | null = [];
  CategoryType: any = CategoryType;
  expensesCategories: any[] | null = []
  incomeCategories: any[] | null = []
  selectedCategoryId: number = 0;
  showModal: boolean = false;
  showAlert: boolean = false;
  classesModal:string = '';
  messageModal:string = '';

  constructor(private supabase: SupabaseService ,private router: Router, private route: ActivatedRoute) { }
  async ngOnInit(): Promise<void> {
    this.user = await this.supabase.getUser();
    this.getProfile(this.user);
  }

  async getProfile(user:any) {
    try {
      const role =  user && user.user_metadata['role'] ? user.user_metadata['role'] : user.user_meta.role;  
      
      if (role == UserRoles.Normal || role == UserRoles.Premium) {
        this.isPremium = role == UserRoles.Premium ? false : true; //Valida que el usuario sea Premium
        this.getCategories(user.id);
        this.getTransactions(user.id);
        this.getCategory(user.id);
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

  async getTransactions(user_uuid:string) {
    let newArray: any[] = [];

    await this.supabase.getExpensesHistory(user_uuid).then(resp => {
      if (!resp.error && resp.expense_history) {
        resp.expense_history.map((item: any) => { item.typeExpense = true; item.showFormEdit = false; return item })
        newArray = newArray.concat(resp.expense_history);
      } else {
        console.warn(resp.error);
      }
    });

    await this.supabase.getIncomesHistory(user_uuid).then(resp => {
      if (!resp.error && resp.income_history) {
        resp.income_history.map((item: any) => { item.typeExpense = false; item.showFormEdit = false; return item })
        newArray = newArray.concat(resp.income_history);
      } else {
        console.warn(resp.error);
      }
    });
    //ordenamiento
    newArray.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB.getTime() - dateA.getTime();
    });
    this.transactionsHistory = newArray;
  }
  getCategories(user_uuid:string){
    this.supabase.getCategoriesExpenses(user_uuid)
      .then(resp => {
        if (!resp.error) {
          this.expensesCategories = resp.category_expense_view;
        } else {
          console.warn(resp.error)
        }
      })
      .catch(err => console.log(err));

    this.supabase.getCategoriesIncome(user_uuid)
      .then(resp => {
        if (!resp.error) {
          this.incomeCategories = resp.category_income;
        } else {
          console.warn(resp.error)
        }
      })
      .catch(err => console.log(err));

  }

  getCategory(user_uuid: string) {
    this.supabase.getBudgets(user_uuid).then((resp) => {
      if (!resp.error) {
        const budMap = resp.budgets_view?.map((item: any) => {
          item.noBudgetAmount = false
          if (item.budget_expected == 0) {
            item.noBudgetAmount = true
          }
          return item;
        })
        this.budgets = budMap? budMap : [];
      } else {
        console.warn(resp.error);
      }
    });
  }
  updateTransaction(isExpense: boolean, id_transaction: number, category_id: number | string, description_transaction: string, transaction_amount: number, transaction_date: Date | string) {
    
    if (isExpense) {
      
      this.supabase.updateExpense(id_transaction, category_id, description_transaction, transaction_amount, transaction_date).then((resp) => {
        if (!resp.error) {
          setTimeout(() => {
            location.reload();
          }, 200)
        } else {
          console.warn(resp.error);
        }
      });
    } else {
      
      this.supabase.updateIncome(id_transaction, category_id, description_transaction, transaction_amount, transaction_date).then((resp) => {
        if (!resp.error) {
          setTimeout(() => {
            location.reload();
          }, 200)
        } else {
          console.warn(resp.error);
        }
      });
    }

  }
  openFormEditTransaction(category_id: number) {
    this.selectedCategoryId = category_id
  }
  deleteTransaction(id_transaction: number, expense_boolean: boolean) {
    if (expense_boolean) {
      this.supabase.deleteExpense(id_transaction).then(
        resp => {
          if (resp.error) {
            this.closeModal();
            this.openAlert('text-red', 'Error al eliminar el movimiento.');
          } else {
            setTimeout(() => {
              location.reload();
            }, 200)
          }
        }
      )
    } else {
      this.supabase.deleteIncome(id_transaction).then(
        resp => {
          if (resp.error) {
            this.closeModal();
            this.openAlert('text-red', 'Error al eliminar el movimiento.');
          } else {
            setTimeout(() => {
              location.reload();
            }, 200)
          }
        }
      )
    }
  }
  closeModal() {
    this.showModal = false;
  }
  openModal() {
    this.showModal = true;
  }
  openAlert(className:string, message:string){
    this.messageModal = message;
    this.classesModal = className;
    this.showAlert = true;
  }
  closeAlert(){
    this.messageModal = '';
    this.classesModal = '';
    this.showAlert = false;
  }
}
