import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SupabaseService } from 'src/app/core/shared/services/supabase.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
})
export class ResetPasswordComponent implements OnInit {
  loading = false;
  showmessage = false;
  showLoginWP = false;
  showAlertModal: boolean = false;
  classesModal: string = '';
  messageModal: string = '';
  resetPassForm = this.formBuilder.group({
    // email: ['', [Validators.required, Validators.email]],
    pass: ['', [Validators.required, Validators.minLength(6)]],
    confirmPass: ['', [Validators.required, Validators.minLength(6)]],
  });
  typeEvent:string = '';
  user:any;
  isRecovery:boolean = true

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private readonly supabase: SupabaseService,
    private readonly formBuilder: FormBuilder,
  ) {
  }

  async ngOnInit(): Promise<void> {
    if (this.supabase.session) {
      this.user =  this.supabase.session.user
      // this.resetPassForm.patchValue({
      //   email: this.user.email
      //   });
    }else{
      this.resetPassForm.reset();
      console.log('Session Cerrada')
    }
  }
  resetPass() {
    if (this.resetPassForm.value.pass != this.resetPassForm.value.confirmPass) {
      this.openAlert('text-red', 'Passwords diferentes');
      return;
    }
    if (!this.resetPassForm.valid || !this.resetPassForm.value.pass) {
      this.openAlert('text-red', 'Formulario invalido');
      return;
    }
    const newPass = this.resetPassForm.value.pass;
    this.supabase
      .resetPassword(newPass)
      .then((resp: any) => {
        if (resp.error) {
          this.openAlert('text-red','Error al resetear el password, comunicarse con el administrador.',
          );
        } else {
          this.openAlert('text-accent', 'Reseteo de password correcto.');
        }
      })
      .catch((error) => {
        this.openAlert('text-red', `${error}`);
      });
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
    this.router.navigate(['login'], {
      queryParams: { 'pass-reseted': 1 },
    });
  }
}
