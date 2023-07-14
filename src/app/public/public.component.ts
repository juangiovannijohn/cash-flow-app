import { Component, OnInit , Input} from '@angular/core';
import { ActivatedRoute, Router, RouterLinkActive } from '@angular/router';
import { Profile, SupabaseService } from 'src/app/core/shared/services/supabase.service';
import { AuthSession } from '@supabase/supabase-js'
@Component({
  selector: 'app-public',
  templateUrl: './public.component.html',
  styleUrls: ['./public.component.css']
})
export class PublicComponent implements OnInit {
user:any;
  constructor(private supabase:SupabaseService, private router: Router, private route: ActivatedRoute) { }

  async ngOnInit(): Promise<void> {
    this.supabase.authChanges((event, sesion) => {

      if (event === 'SIGNED_IN' && sesion?.user.aud == 'authenticated') {
        this.supabase.profile(sesion.user).then(
          resp => {
            if (!resp.error) {
              const {role} = resp.data;
              if (role == 'user') {
                this.router.navigate(['intranet']);
              } else if (role == 'admin') {
                this.router.navigate(['dashboard-admin']);
              } else {
                alert('se cerro sesion');
                this.cerrarSesion();
              }
            }
          }
        );
      } else if (event === 'SIGNED_OUT') {
        this.router.navigate(['login']);
      }

    })
  }

  cerrarSesion(){
    this.supabase.signOut();
    this.router.navigate(['login']);
  }
}
