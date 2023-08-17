import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router, RouterLinkActive } from '@angular/router';
import { Profile, SupabaseService } from 'src/app/core/shared/services/supabase.service';
import { AuthSession } from '@supabase/supabase-js'
import { UserRoles } from '../core/models-interface/enums';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-dashboard-clients',
  templateUrl: './dashboard-clients.component.html',
  styleUrls: ['./dashboard-clients.component.css']
})
export class DashboardClientsComponent implements OnInit {
  open = false;
  userRole:string = '';
  user: any;
  profile!: Profile | any;
  loading = false;
  showModal: boolean = false;

  constructor(private router: Router, private route: ActivatedRoute, private supabase: SupabaseService) {

  }

  async ngOnInit(): Promise<void> { 
    if (!environment.production) {
      console.log('hola dashboard-clients component---------')
      const urlRelativa = this.router.url;
      const urlAbsoluta = this.route.snapshot.url.map(segment => segment.path).join('/');
      const urlCompleta = `${window.location.origin}/${urlAbsoluta}`;
      console.log('URL completa:', window.location.href);
      console.log('urlRelativa(desp de la /)', urlRelativa);
      console.log('urlAbsoluta(antes de la /)', urlAbsoluta);
      console.log('URL completa:', urlCompleta);
      console.log('---------------------')
    }
    this.route.queryParamMap.subscribe(param => {
      const params = param.get('type') ? param.get('type') : '';
      switch (params) {
        case 'magiclink':
          console.log('se ejecuta redireccion')
          this.router.navigate(['intranet/movimientos'], { relativeTo: this.route });
          break;
      
        default:
          break;
      }
    })
    this.user = await this.supabase.getUser()

  await this.getProfile(this.user);
   this.supabase.eventSubject.subscribe((event) => {
      if (event == 'SIGNED_IN') {
        this.getProfile(this.user);
      }
    });
  }
  async getProfile(user:any) {
    try {
      const role = this.user && this.user.user_metadata['role'] ? this.user.user_metadata['role'] : (await this.supabase.profile(user)).data?.role; 
      if (role == UserRoles.Normal || role == UserRoles.Premium) {
        this.router.navigate(['movimientos'], { relativeTo: this.route });
      } else {
        console.log('se cerro sesion')
        this.cerrarSesion();
      }
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message)
      }
    }
  }

  toggleMenu() {
    this.open = !this.open;
  }
  async cerrarSesion() {
    this.supabase.signOut();
    this.router.navigate(['login']);
  }
  closeModal() {
    this.showModal = false;
  }
  openModal() {
    this.showModal = true;
  }
}
// https://mdksvmcmnozfbyvbgpss.supabase.co/auth/v1/verify?token=87a1f7687f6d9877411a398b96a0eb0f069f0eeed33d1cc69aecb585&type=signup&redirect_to=http://localhost:4200/access-token