import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { SharedModule } from './core/shared/shared.module';
import { ResetPasswordComponent } from './public/reset-password/reset-password.component';
import { FormsModule, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './public/home/containers/home.component';
import { LoginComponent } from './public/login/containers/login.component';
import { BlogComponent } from './public/blog/containers/blog.component';
import { ConfirmationUserComponent } from './public/confirmation-user/confirmation-user.component';
import { SignupComponent } from './public/signup/signup.component';
import { RequestResetPasswordComponent } from './public/request-reset-password/request-reset-password.component';
import { PricingComponent } from './public/pricing/pricing.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    BlogComponent,
    ConfirmationUserComponent,
    SignupComponent,
    ResetPasswordComponent,
    RequestResetPasswordComponent,
    PricingComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [ResetPasswordComponent, FormBuilder],
  bootstrap: [AppComponent,]
})
export class AppModule {
  constructor() {
  }
}
