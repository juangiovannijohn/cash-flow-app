import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Notfound404Component } from './core/shared/components/notfound404/notfound404.component';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./public/public.module').then( m => m.PublicModule )
  },
  // {
  //   path: '',
  //   loadChildren: () => import('./dashboard-clients/dashboard-clients.module').then( m => m.DashboardClientsModule )
  // },
  {path: '**',redirectTo: '' } //, component: Notfound404Component
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})], //usehash para el reload de la pagina.. investigar
  exports: [RouterModule]
})
export class AppRoutingModule { }
