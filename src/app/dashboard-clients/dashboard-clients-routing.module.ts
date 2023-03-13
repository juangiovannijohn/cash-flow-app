import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardClientsComponent } from './dashboard-clients.component';
import { SaldoWalletComponent } from './saldo-wallet/saldo-wallet.component';

const routes: Routes = [
  {
    path:'', component: DashboardClientsComponent, children:
    [
     {path: 'hola', component: SaldoWalletComponent}
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardClientsRoutingModule { }
