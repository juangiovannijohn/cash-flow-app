import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PublicRoutingModule } from './public-routing.module';
import { HomeComponent } from './home/containers/home.component';
import { PublicComponent } from './public.component';
import { LoginComponent } from './login/containers/login.component';
import { BlogComponent } from './blog/containers/blog.component';
import { SharedModule } from '../core/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    HomeComponent,
    PublicComponent,
    LoginComponent,
    BlogComponent
  ],
  imports: [
    CommonModule,
    PublicRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ],
  exports:[],
  providers: []
})
export class PublicModule { 
  constructor(){
  }
}
