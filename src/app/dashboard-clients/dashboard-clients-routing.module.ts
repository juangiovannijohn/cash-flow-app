import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardClientsComponent } from './dashboard-clients.component';
import { SaldoWalletComponent } from './saldo-wallet/saldo-wallet.component';
import { PerfilUsuarioComponent } from './perfil-usuario/perfil-usuario.component';
import { NewTransactionComponent } from './new-transaction/new-transaction.component';

const routes: Routes = [
  {
    path:'', component: DashboardClientsComponent, children:
    [
     {path: 'perfil', component: PerfilUsuarioComponent},
     {path: 'balance', component: SaldoWalletComponent},
     {path: 'movimientos', component: NewTransactionComponent},   
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardClientsRoutingModule { }
