import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators  } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthChangeEvent, Session } from '@supabase/supabase-js';
import { Subscription } from 'rxjs';
import { UserRoles } from 'src/app/core/models-interface/enums';
import { SupabaseService } from 'src/app/core/shared/services/supabase.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit  {
  loading = false
  showLoginWP= false;
  user:any;
  signInForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]]
  })
  loginFormWP = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    pass: ['', [Validators.required, Validators.minLength(6)]]
  });
  showAlertModal:boolean=false;
  classesModal:string = '';
  messageModal:string = '';
  showIntranet: boolean = false;
  constructor(private router: Router, private route: ActivatedRoute,
    private readonly supabase: SupabaseService,
    private readonly formBuilder: FormBuilder
  ) {
    //TODO mostrar mensajes dinamicos en base a los params
    // params = pass-reseted=1
    // pass-reseted
    // new-user
    // req-reset-pass
  }
  async ngOnInit(): Promise<void> {
    this.supabase.authChanges(this.handleAuthChange);
  }
  // muestra un link de ingreso o no si la session esta abierta.
  handleAuthChange = (event: AuthChangeEvent, session: Session | null) => {
    this.showIntranet = session ? true : false;
  };
  async onSubmit(): Promise<void> {
    try {
      this.loading = true
      const email = this.signInForm.value.email as string
      const { error } = await this.supabase.loginWithOtp(email)
      if (error) throw error
        this.openAlert('text-accent', 'Revisa tu casilla de correos para loguearte.')
    } catch (error) {
      if (error instanceof Error) {
        this.openAlert('text-red', `${error.message}`)
      }
    } finally {
      this.signInForm.reset()
      this.loading = false
    }
  }
  async login(): Promise<void> {
    try {
      this.loading = true
      const email = this.loginFormWP.value.email as string
      const pass = this.loginFormWP.value.pass as string
      const { userLogged, error } = await this.supabase.loginWithPassword(email, pass)
      if (error) throw error
      //Ruteo interno
      if (userLogged.user) {
        const role = userLogged.user.user_metadata['role'] ? userLogged.user.user_metadata['role'] : userLogged.profile.role ; //Aca valido que el rol este en la tabla profile o en la tabla users
        switch (role) {
          case UserRoles.Normal:
            this.router.navigate(['intranet/movimientos']);
            break;
            case UserRoles.Premium:
              this.router.navigate(['intranet/movimientos']);
            break;
            case UserRoles.Colaborador:
              this.router.navigate(['dashboard-admin']);
            break;
            case UserRoles.Admin:
              this.router.navigate(['dashboard-admin']);
            break;
          default:
            this.router.navigate(['login']);
            break;
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        this.openAlert('text-red', `${error.message}`);
        this.supabase.signOut();
      }
    } finally {
      this.loginFormWP.reset()
      this.loading = false
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
