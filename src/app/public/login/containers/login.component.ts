import { Component } from '@angular/core';
import { LoginService } from '../services/login.service';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup, Validators  } from '@angular/forms';
import { Router } from '@angular/router';
import { SupabaseService } from 'src/app/core/shared/services/supabase.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent  {
  loading = false

  signInForm = this.formBuilder.group({
    email: '',
  })

  constructor(
    private readonly supabase: SupabaseService,
    private readonly formBuilder: FormBuilder
  ) {}

  async onSubmit(): Promise<void> {
    try {
      this.loading = true
      const email = this.signInForm.value.email as string
      const { error } = await this.supabase.signIn(email)
      if (error) throw error
      alert('Check your email for the login link!')
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message)
      }
    } finally {
      this.signInForm.reset()
      this.loading = false
    }
  }
}


// get usuario(){
//   return this.loginService.Usuario;
// }
// login: FormGroup;
// loginError:boolean = false;

  
//   constructor(
//     private loginService:LoginService,
//     private form: FormBuilder,
//     private router: Router
//     ) {
//       this.login= this.form.group({
//         email:['manu@manu.com', [Validators.required, Validators.email]],
//         pass:['manu', [Validators.required]],
//       })
//     }

//   ngOnInit(): void {


//   }


//   campoNoValido(campo: string ){
//     return this.login.get(campo)?.invalid
//              && this.login.get(campo)?.touched;
//   }

//   onSubmit() {
   
//     this.loginService.login(this.login.value.email,this.login.value.pass ).subscribe({
//       next: (resp:any) => {
//         if (resp.ok) {
//           //TODO: mejorar esta navegacion con los guards y el objeto Usuario que vendra del service
//           if(resp.user.role === 'user') {
//             this.router.navigate(['/intranet']);
//           } 
//           if (resp.user.role === 'admin') {
//               this.router.navigate(['/dashboard-admin']);
//           } 
//           if (resp.user.role === 'public') {
//             this.router.navigate(['/blog']);
//           } 
  
//         }else{
//           this.loginError = true;
//         }
//       },
//       error: err => {
//         console.log(err);
//         this.loginError = true;
//       }
//     })
//   }

// }
