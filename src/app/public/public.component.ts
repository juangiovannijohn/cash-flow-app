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
  constructor(private supabase:SupabaseService, private router: Router, private route: ActivatedRoute) {
   }

  async ngOnInit(): Promise<void> {
    this.router.navigate(['login']);
  }

  cerrarSesion(){
    this.supabase.signOut();
    this.router.navigate(['login']);
  }
}
