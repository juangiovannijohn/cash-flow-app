import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/public/login/services/login.service';
import { TransactionHistoryService } from './service/transaction-history.service';

@Component({
  selector: 'app-transaction-history',
  templateUrl: './transaction-history.component.html',
  styleUrls: ['./transaction-history.component.css']
})
export class TransactionHistoryComponent implements OnInit {
  get Usuario(){
    return this.loginService.Usuario
  }
  transactions: any[] = []
  transactions_user: any[]= []
  categories: any[] = []
  nombre:any = this.Usuario.email
  id:any = this.Usuario.id

    constructor(
      private loginService:LoginService,
      private transactionsService: TransactionHistoryService
    ) {}
  
    ngOnInit(): void {
      this.transactions_user = this.Usuario.transaccions
      this.categories  = this.Usuario.categories_expenses
     this.getTransactions();
    }
    getTransactions(){
     
      const hola = this.transactions_user.map(item => {
        //TODO_ agregar el nombre de la categoria a las transacciones segun su ID
        console.log({item})
       
      })
      
      // this.transactionsService.getTransactions(this.id).subscribe({
      //   next: transactions =>  {
      //     this.transactions= transactions
      //     console.log(this.transactions)
      //   }
      // })
    }


}
