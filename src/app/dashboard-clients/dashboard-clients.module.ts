import { NgModule } from '@angular/core';
import { CommonModule , DatePipe } from '@angular/common';

import { SharedModule } from '../core/shared/shared.module';
import { DashboardClientsRoutingModule } from './dashboard-clients-routing.module';
import { SaldoWalletComponent } from './saldo-wallet/saldo-wallet.component';
import { CashflowComponent } from './cashflow/cashflow.component';
import { NewTransactionComponent } from './new-transaction/new-transaction.component';
import { DashboardClientsComponent } from './dashboard-clients.component';
import { TransactionHistoryComponent } from './transaction-history/transaction-history.component';
import { PerfilUsuarioComponent } from './perfil-usuario/perfil-usuario.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ConfirmDeleteCategoryComponent } from '../core/shared/components/confirm-delete-category/confirm-delete-category.component';
import { MonthsPipe } from '../core/models-interface/months.pipe';
import { OldBudgetsComponent } from './old-budgets/old-budgets.component';
import { MyCategoriesComponent } from './my-categories/my-categories.component';
import { ArsPipe } from '../core/models-interface/ars.pipe';
import { UpdateProfileComponent } from './update-profile/update-profile.component';



@NgModule({
  declarations: [
      SaldoWalletComponent,
      CashflowComponent,
      NewTransactionComponent,
      DashboardClientsComponent,
      TransactionHistoryComponent,
      PerfilUsuarioComponent,
      MonthsPipe,
      OldBudgetsComponent,
      MyCategoriesComponent,
      ArsPipe,
      UpdateProfileComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    DashboardClientsRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports:[],
  providers: [
    DatePipe,
  ]
})
export class DashboardClientsModule { 
  constructor(){
  }
}
