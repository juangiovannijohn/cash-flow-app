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
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
      SaldoWalletComponent,
      CashflowComponent,
      NewTransactionComponent,
      DashboardClientsComponent,
      TransactionHistoryComponent,
      PerfilUsuarioComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    DashboardClientsRoutingModule,
    ReactiveFormsModule
  ],
  exports:[],
  providers: [
    DatePipe,]
})
export class DashboardClientsModule { 
  constructor(){
  }
}
