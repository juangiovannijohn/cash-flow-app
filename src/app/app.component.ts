import { Component, OnInit } from '@angular/core';
import { SupabaseService } from './core/shared/services/supabase.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  implements OnInit {
  title = 'cash-flow';
  _hola :any
  session = this.supabase.session;
  constructor(private readonly supabase: SupabaseService,private router: Router, private route: ActivatedRoute) {
  }
  ngOnInit() {
    if (!environment.production) {
      console.log('hola app component---------')
      const urlRelativa = this.router.url;
      const urlAbsoluta = this.route.snapshot.url.map(segment => segment.path).join('/');
      // const urlCompleta = `${window.location.origin}/${urlAbsoluta}`;
      console.log('URL completa:', window.location.href);
      // console.log('urlRelativa(desp de la /)', urlRelativa);
      // console.log('urlAbsoluta(antes de la /)', urlAbsoluta);
      // console.log('URL completa:', urlCompleta);
      console.log('---------------------')
    }

    this.supabase.eventSubject.subscribe((event) => {
      if (event == 'PASSWORD_RECOVERY') {
        console.log('event', this._hola);
        console.log('session', this.session);
        this.router.navigate(['reset-password'], { relativeTo: this.route });
      }
    });
    this.supabase.authChanges((hola, session) => {
      (this.session = session);
      (this._hola = hola);
    })
  }
}
