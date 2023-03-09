import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../core/shared/shared.module';
import { DashboardClientsRoutingModule } from './dashboard-clients-routing.module';


@NgModule({
  declarations: [
  ],
  imports: [
    SharedModule,
    DashboardClientsRoutingModule
  ],
  exports:[],
  providers: []
})
export class DashboardClientsModule { 
  constructor(){
    console.log('se cargo el modulo dashboard clientes')
  }
}
