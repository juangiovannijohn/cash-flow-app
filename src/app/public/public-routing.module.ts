import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlogComponent } from './blog/containers/blog.component';
import { HomeComponent } from './home/containers/home.component';
import { LoginComponent } from './login/containers/login.component';
import { PublicComponent } from './public.component';
import { SignupComponent } from './signup/signup.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { RequestResetPasswordComponent } from './request-reset-password/request-reset-password.component';

const routes: Routes = [
  {
    path:'', component: PublicComponent, children:
    [
      {path: 'landing', component: HomeComponent},
      {path: 'login', component: LoginComponent},
      {path: 'blog', component: BlogComponent },
      {path: 'signup', component: SignupComponent},
      // {path: 'access_token', component: ResetPasswordComponent},
      {path: 'reset', component: RequestResetPasswordComponent},
    ]
  },
  {
    path: 'intranet',
    loadChildren: () => import('./../dashboard-clients/dashboard-clients.module').then( m => m.DashboardClientsModule )
  },
  {
    path: 'dashboard-admin',
    loadChildren: () => import('./../dashboard-admin/dashboard-admin.module').then( m => m.DashboardAdminModule )
  },

  

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule { }
