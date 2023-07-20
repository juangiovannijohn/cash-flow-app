import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators  } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SupabaseService } from 'src/app/core/shared/services/supabase.service';

@Component({
  selector: 'app-request-reset-password',
  templateUrl: './request-reset-password.component.html',
  styleUrls: ['./request-reset-password.component.css']
})
export class RequestResetPasswordComponent {
  loading = false
  showmessage= false;
  showLoginWP= false;
  showAlertModal:boolean=false;
  classesModal:string = '';
  messageModal:string = '';
  requestForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]]
  })
  constructor(private router: Router, private route: ActivatedRoute,
    private readonly supabase: SupabaseService,
    private readonly formBuilder: FormBuilder) { }

  requestNewPass(){
    if (this.requestForm.valid && this.requestForm.value.email) {
      const email = this.requestForm.value.email;
      this.supabase.requestResetPass(email).then(resp=>{
        if (resp.error) {
          this.openAlert('text-red', 'Error al enviar correo de recuperación de password, comunicarse con el administrador')
        }else{
          this.openAlert('text-accent', 'Correo de recuperación enviado correctamente, revise su casilla.')
          this.router.navigate(['login'], { queryParams: { 'req-reset-pass' : 1}});
        }
      })
      .catch(error => {
        this.openAlert('text-red', `${error}`)
      })
      // Restablecer los valores y el estado del formulario
      this.requestForm.patchValue({
      email: ''
      });
    }
  }
  openAlert(className:string, message:string){
    this.messageModal = message;
    this.classesModal = className;
    this.showAlertModal = true;
  }
  closeAlert(){
    this.messageModal = '';
    this.classesModal = '';
    this.showAlertModal = false;
  }


}
