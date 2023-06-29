import { Component, OnInit } from '@angular/core';
import { SupabaseService } from './core/shared/services/supabase.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  implements OnInit {
  title = 'cash-flow';
  session = this.supabase.session;
  constructor(private readonly supabase: SupabaseService) {}
  ngOnInit() {
    this.supabase.authChanges((_, session) => (this.session = session))
  }
}
