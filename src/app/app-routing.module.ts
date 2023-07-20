import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Notfound404Component } from './core/shared/components/notfound404/notfound404.component';
import { ResetPasswordComponent } from './public/reset-password/reset-password.component';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./public/public.module').then( m => m.PublicModule )
  },
  {
    path: 'reset-password', component: ResetPasswordComponent
  },
  {
    path: 'access_token', component: ResetPasswordComponent
  },
  // {
  //   path: '',
  //   loadChildren: () => import('./dashboard-clients/dashboard-clients.module').then( m => m.DashboardClientsModule )
  // },
  {path: '**', component: Notfound404Component } //, component: Notfound404Component
];

@NgModule({
  imports: [RouterModule.forRoot(routes)], //usehash para el reload de la pagina.. investigar
  exports: [RouterModule]
})
export class AppRoutingModule { }
