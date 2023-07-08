import { Component, OnInit } from '@angular/core';
import { TransactionsDetails } from 'src/app/core/models-interface/interfaces';
import { SupabaseService } from 'src/app/core/shared/services/supabase.service';
import { CategoryType } from 'src/app/core/models-interface/enums';


@Component({
  selector: 'app-saldo-wallet',
  templateUrl: './saldo-wallet.component.html',
  styleUrls: ['./saldo-wallet.component.css']
})
export class SaldoWalletComponent implements OnInit {
  transactions: TransactionsDetails[] | any = [];
  budgets: any[] | null= [];
  CategoryType: any = CategoryType
user_uuid: string = '8085f1c3-464a-4a01-8878-555277c367e0'
  constructor(
    private supabase: SupabaseService
  ) { }

  ngOnInit(): void {
    this.getTransactions();
    this.getCategory(this.user_uuid);
  }
  getTransactions(){
    this.supabase.getTransactions().then(
      resp => {
        if (!resp.error) {
          this.transactions = resp.transactions;
        } else {
          console.warn(resp.error)
        }
      }
    )
  }
  getCategory(user_uuid:string){
    this.supabase.getBudgets(user_uuid).then(
      resp => {
        if (!resp.error) {
          this.budgets = resp.budgets_view;
          console.log('budgets',resp)
        } else {
          console.warn(resp.error)
        }
      }
    )
  }
}
