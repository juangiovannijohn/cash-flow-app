import { Component, OnInit } from '@angular/core';
import { GPExpenses, GPExpensesDatum, GPIncomes, GPIncomesDatum, TransactionHistory, TransactionsDetails } from 'src/app/core/models-interface/interfaces';
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
  budgets: any[] = [];
  CategoryType: any = CategoryType;
  expensesCategories: any[] | null = []
  incomeCategories: any[] | null = []
  selectedCategoryId: number = 0;
  showModal: boolean = false;
  showAlert: boolean = false;
  classesModal:string = '';
  messageModal:string = '';

  //old budgets
  titleOldBudgets:string = 'Balances anteriores'
  currentMonth: number = 0;
  currentYear: number = 0;

  //Estado perdidas y ganancias
  showDetails:boolean = true;
  GPExpenses: GPExpensesDatum[]= []
  GPIncomes: GPIncomesDatum[]= []
  GPExpSum: number = 0
  GPIncSum: number = 0
  currentMounth:string ='';

  constructor(private supabase: SupabaseService ,private router: Router, private route: ActivatedRoute) { }
  async ngOnInit(): Promise<void> {
    const currentDate = new Date();
    this.currentYear =  currentDate.getFullYear();
    this.currentMonth = currentDate.getMonth() + 1;
    this.user = await this.supabase.getUser();
    this.getProfile(this.user, this.currentYear, this.currentMonth);

    //Estado perdidas y ganancias
    this.getGananciasPerdidasExpenses(this.user.id, this.currentYear, this.currentMonth);
    this.getGananciasPerdidasIncomes(this.user.id, this.currentYear, this.currentMonth);
    this.currentMounth = this.obtenerMesActualEnEspanol(this.currentMonth)
  }

  //para modificar los meses anteriores y futuros
  getCategoriesOldExpenses(year:number, month:number){
    this.currentMonth= month;
    this.currentYear = year;
    this.getCategories(this.user.id, year, month);
    this.getTransactions(this.user.id, year, month);
    this.getCategory(this.user.id, year, month);
    this.getGananciasPerdidasExpenses(this.user.id, year, month);
    this.getGananciasPerdidasIncomes(this.user.id, year, month);
    this.currentMounth = this.obtenerMesActualEnEspanol(month)
  }

  async getProfile(user:any, currentYear?:number, currentMonth?:number) {
    try {
      const role =  user && user.user_metadata['role'] ? user.user_metadata['role'] : user.user_meta.role;  
      
      if (role == UserRoles.Normal || role == UserRoles.Premium) {
        this.isPremium = role == UserRoles.Premium ? false : true; //Valida que el usuario sea Premium
        this.getCategories(user.id, currentYear, currentMonth);
        this.getTransactions(user.id, currentYear, currentMonth);
        this.getCategory(user.id, currentYear, currentMonth);
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

  async getTransactions(user_uuid:string, year?:number, month?:number) {
    let newArray: any[] = [];

    await this.supabase.getExpensesHistory(user_uuid, year, month).then(resp => {
      if (!resp.error && resp.expense_history) {
        resp.expense_history.map((item: any) => { item.typeExpense = true; item.showFormEdit = false; return item })
        newArray = newArray.concat(resp.expense_history);
      } else {
        console.warn(resp.error);
      }
    });

    await this.supabase.getIncomesHistory(user_uuid, year, month).then(resp => {
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
  getCategories(user_uuid:string, year?:number, month?:number){
    this.supabase.getCategoriesExpenses(user_uuid, year, month)
      .then(resp => {
        if (!resp.error) {
          this.expensesCategories = resp.category_expense_view;
        } else {
          console.warn(resp.error)
        }
      })
      .catch(err => console.log(err));

    this.supabase.getCategoriesIncome(user_uuid, year, month)
      .then(resp => {
        if (!resp.error) {
          this.incomeCategories = resp.category_income;
        } else {
          console.warn(resp.error)
        }
      })
      .catch(err => console.log(err));

  }

  getCategory(user_uuid: string, year?:number, month?:number) {
    this.supabase.getBudgets(user_uuid, year, month).then((resp) => {
      if (!resp.error) {
        const budMap = resp.budgets?.map((item: any) => {
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

  getGananciasPerdidasExpenses(user_uuid: string, year?:number, month?: number){
    this.supabase.getGananciasPerdidasExpenses(user_uuid,month,year ).then((resp:GPExpenses | any) =>{
      this.GPExpenses = resp.data? resp.data : [];
      let total:number = 0
      if (resp.data && resp.data.length > 0){
        const dataArray = resp.data.map((item: any) => {
          total += item.sum
          return item
        })
      }
      this.GPExpSum = total
    })
  }
  getGananciasPerdidasIncomes(user_uuid: string, year?:number, month?: number){
    this.supabase.getGananciasPerdidasIncomes(user_uuid,month,year).then((resp:GPIncomes | any ) =>{
      this.GPIncomes = resp.data? resp.data : [];
      let total:number = 0
      if (resp.data && resp.data.length > 0){
        const dataArray = resp.data.map((item: any) => {
          total += item.sum
          return item
        })
      }
      this.GPIncSum = total
    })
    
  }
  obtenerMesActualEnEspanol(month: number): string {
    const mesesEnEspanol = [
      "enero", "febrero", "marzo", "abril", "mayo", "junio",
      "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
    ];
  
    if (month < 1 || month > 12) {
      throw new Error("El número del mes debe estar entre 1 y 12.");
    }
  
    return mesesEnEspanol[month - 1].charAt(0).toUpperCase() + mesesEnEspanol[month - 1].slice(1);
  }
}
