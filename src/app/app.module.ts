import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { SharedModule } from './core/shared/shared.module';
import { ResetPasswordComponent } from './public/reset-password/reset-password.component';
import { FormsModule, FormBuilder } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
FormsModule

  ],
  providers: [ResetPasswordComponent, FormBuilder],
  bootstrap: [AppComponent, ]
})
export class AppModule { 
  constructor(){
  }
}
