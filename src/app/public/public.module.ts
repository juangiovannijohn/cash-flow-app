import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PublicRoutingModule } from './public-routing.module';
import { HomeComponent } from './home/containers/home.component';
import { PublicComponent } from './public.component';
import { LoginComponent } from './login/containers/login.component';
import { BlogComponent } from './blog/containers/blog.component';
import { SharedModule } from '../core/shared/shared.module';


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
    SharedModule
  ],
  exports:[],
  providers: []
})
export class PublicModule { 
  constructor(){
    console.log('se cargo el modulo Public')
  }
}
