import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SupabaseService } from 'src/app/core/shared/services/supabase.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  loading = false
  showAlertModal: boolean = false;
  classesModal: string = '';
  messageModal: string = '';

  signupForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    pass: ['', [Validators.required, Validators.minLength(6)]],
    passConfirm: ['', [Validators.required, Validators.minLength(6)]]
  })


  constructor(private router: Router, private route: ActivatedRoute,
    private supabase: SupabaseService,
    private formBuilder: FormBuilder
  ) { }


  async signup(): Promise<void> {
    const pass = this.signupForm.value.pass;
    const passConfirm = this.signupForm.value.passConfirm;
    if (this.signupForm.invalid || pass != passConfirm) {
      this.openAlert('text-red', 'El email no es correcto, o el pasword tiene menos de 6 catacteres')
      this.signupForm.reset();
      // this.supabase.signOut();
    } else {
      try {
        this.loading = true
        const email = this.signupForm.value.email as string
        const pass = this.signupForm.value.pass as string
        const { data, error } = await this.supabase.signUp(email, pass)
        if (error) throw error;
        this.openAlert('text-accent', 'Revise su casilla de correos para confirmar su email');
      } catch (error) {
        if (error instanceof Error) {
          this.openAlert('text-red', 'Error al crear el usuario')
        }
      } finally {
        this.signupForm.reset()
        this.loading = false
      }
    }
  }

  openAlert(className: string, message: string) {
    this.messageModal = message;
    this.classesModal = className;
    this.showAlertModal = true;
  }
  closeAlert() {
    this.messageModal = '';
    this.classesModal = '';
    this.showAlertModal = false;
    this.supabase.signOut();
    this.router.navigate(['login'], {
      queryParams: { 'new-user': 1 }
    });
  }
}
