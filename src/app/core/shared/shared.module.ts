import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing.module';
import { HttpClientModule } from "@angular/common/http";
import { Notfound404Component } from './components/notfound404/notfound404.component';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    Notfound404Component
  ],
  imports: [
    CommonModule,
    SharedRoutingModule,
    HttpClientModule,
    RouterModule
  ],
  exports: [
    HttpClientModule,
    Notfound404Component,
    RouterModule
  ]
})
export class SharedModule {
  constructor(){
    console.log('se cargo el modulo Shared')
  }
 }
