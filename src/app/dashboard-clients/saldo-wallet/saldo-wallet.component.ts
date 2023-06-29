import { Component, OnInit } from '@angular/core';
import { TransactionsDetails } from 'src/app/core/models-interface/interfaces';
import { SupabaseService } from 'src/app/core/shared/services/supabase.service';
import { CategoryType} from 'src/app/core/models-interface/enums';


@Component({
  selector: 'app-saldo-wallet',
  templateUrl: './saldo-wallet.component.html',
  styleUrls: ['./saldo-wallet.component.css']
})
export class SaldoWalletComponent implements OnInit {
  transactions: TransactionsDetails[] | any= []
  CategoryType : any = CategoryType


  constructor(
    private supabase : SupabaseService
  ) { }

  ngOnInit(): void {
this.supabase.getTransactions().then(
  resp => {
  if (!resp.error) {
    this.transactions = resp.transactions;
    console.log(this.transactions)
    console.log(this.CategoryType.Expense)
    }else{
      console.warn(resp.error)
    }
  }
)
  }
}
