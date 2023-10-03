import { NgModule } from '@angular/core';
import { RouterModule, Routes, ExtraOptions } from '@angular/router';
import { Notfound404Component } from './core/shared/components/notfound404/notfound404.component';
import { ResetPasswordComponent } from './public/reset-password/reset-password.component';
import { HomeComponent } from './public/home/containers/home.component';
import { LoginComponent } from './public/login/containers/login.component';
import { BlogComponent } from './public/blog/containers/blog.component';
import { SignupComponent } from './public/signup/signup.component';
import { RequestResetPasswordComponent } from './public/request-reset-password/request-reset-password.component';
import { AppComponent } from './app.component';
import { PricingComponent } from './public/pricing/pricing.component';

const routes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'login', component: LoginComponent},
  {path: 'signup', component: SignupComponent},
  {path: 'reset', component: RequestResetPasswordComponent},
  {path: 'reset-password', component: ResetPasswordComponent},
  {path: 'access-token', component: ResetPasswordComponent},
  {path: 'landing', component: HomeComponent},
  {path: 'blog', component: BlogComponent },
  {path: 'pricing', component: PricingComponent },
  {
    path: 'intranet',
    loadChildren: () => import('./dashboard-clients/dashboard-clients.module').then(m => m.DashboardClientsModule)
  },
  {
    path: 'dashboard-admin',
    loadChildren: () => import('./dashboard-admin/dashboard-admin.module').then(m => m.DashboardAdminModule)
  },
  { path: '**', component: Notfound404Component } //, component: Notfound404Component
];
const routerOptions: ExtraOptions = {
  scrollPositionRestoration: 'enabled',
  anchorScrolling: 'enabled',
  useHash: true
}

@NgModule({
  imports: [RouterModule.forRoot(routes, routerOptions)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
