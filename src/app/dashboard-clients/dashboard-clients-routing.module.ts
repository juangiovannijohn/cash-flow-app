import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardClientsComponent } from './dashboard-clients.component';

const routes: Routes = [
  {
    path:'', component: DashboardClientsComponent, children:
    [
     
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardClientsRoutingModule { }
