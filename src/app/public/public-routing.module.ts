import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlogComponent } from './blog/containers/blog.component';
import { HomeComponent } from './home/containers/home.component';
import { LoginComponent } from './login/containers/login.component';
import { PublicComponent } from './public.component';

const routes: Routes = [
  {
    path:'', component: PublicComponent, children:
    [
      {path: '', component: HomeComponent},
      {path: 'login', component: LoginComponent},
      {path: 'blog', component: BlogComponent }
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
