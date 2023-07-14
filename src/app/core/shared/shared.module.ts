import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing.module';
import { HttpClientModule } from "@angular/common/http";
import { Notfound404Component } from './components/notfound404/notfound404.component';
import { RouterModule } from '@angular/router';
import { ConfirmDeleteCategoryComponent } from './components/confirm-delete-category/confirm-delete-category.component';
import { AlertMessageModalComponent } from './components/alert-message-modal/alert-message-modal.component';


@NgModule({
  declarations: [
    Notfound404Component,
    ConfirmDeleteCategoryComponent,
    AlertMessageModalComponent,
  ],
  imports: [
    CommonModule,
    SharedRoutingModule,
    HttpClientModule,
    RouterModule,
  ],
  exports: [
    HttpClientModule,
    Notfound404Component,
    RouterModule,
    ConfirmDeleteCategoryComponent,
    AlertMessageModalComponent,
  ]
})
export class SharedModule {
  constructor(){
  }
 }
