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
  id:any = this.Usuario._id

    constructor(
      private loginService:LoginService,
      private transactionsService: TransactionHistoryService
    ) {}
  
    ngOnInit(): void {
     this.getTransactions();
    }
    getTransactions(){
      this.transactionsService.getTransactions(this.id).subscribe({
        next: resp =>  {
          this.transactions= resp.transactions;
        }
      })
    }


}
