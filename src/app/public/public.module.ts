import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PublicRoutingModule } from './public-routing.module';
import { HomeComponent } from './home/home.component';


@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    PublicRoutingModule
  ],
  exports:[],
  providers: []
})
export class PublicModule { 
  constructor(){
    console.log('se cargo el modulo Public')
  }
}
