import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router, RouterLinkActive } from '@angular/router';
import { Profile, SupabaseService } from 'src/app/core/shared/services/supabase.service';
import { AuthSession } from '@supabase/supabase-js'

@Component({
  selector: 'app-dashboard-clients',
  templateUrl: './dashboard-clients.component.html',
  styleUrls: ['./dashboard-clients.component.css']
})
export class DashboardClientsComponent implements OnInit {
  open = false;
  userRole:string = '';
  profile!: Profile | any;
  loading = false
  @Input()
  session: AuthSession | any = this.supabase.session ? this.supabase.session : null
  constructor(private router: Router, private route: ActivatedRoute, private supabase: SupabaseService) {
    
  }

  async ngOnInit(): Promise<void> {

   this.getProfile();
   this.supabase.eventSubject.subscribe((event) => {
    if(event = 'SIGNED_IN'){
      this.getProfile();
    }
  });
  }
  async getProfile() {
    try {
      const { user } = this.session
      let { data: profile, error, status } = await this.supabase.profile(user)
      if (error && status !== 406) {
        throw error
      }
      if (profile) {
        this.userRole = profile['role'] ? profile['role'] : '';
        this.profile = profile;
        if (this.userRole == 'user') {
          this.router.navigate(['movimientos'], { relativeTo: this.route });
        } else {
          console.log('se cerro sesion')
          this.cerrarSesion();
        }
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
}
