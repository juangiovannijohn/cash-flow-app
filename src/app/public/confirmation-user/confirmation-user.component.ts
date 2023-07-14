import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SupabaseService } from 'src/app/core/shared/services/supabase.service';

@Component({
selector: 'app-confirmation-user',
templateUrl: './confirmation-user.component.html',
styleUrls: ['./confirmation-user.component.css']
})
export class ConfirmationUserComponent implements OnInit {
confirmationToken: string = ''

constructor(
private route: ActivatedRoute,
private supabase: SupabaseService,
private router: Router
) { 
  this.route.queryParams.subscribe(params => {
    this.confirmationToken = params['token'];
    // Utiliza el valor del token para realizar las acciones necesarias, como confirmar el registro del usuario en Supabase.
    this.confirmRegistration();
    });
}


ngOnInit() {
}

confirmRegistration() {

}
}
