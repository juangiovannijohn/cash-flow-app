import { Component, OnInit } from '@angular/core';
import { LoginService } from '../services/login.service';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup, Validators  } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
login: FormGroup;
loginError:boolean = false;

  
  constructor(
    private loginService:LoginService,
    private form: FormBuilder,
    private router: Router
    ) {
      this.login= this.form.group({
        email:['juan@juan.com', [Validators.required, Validators.email]],
        pass:['juan', [Validators.required]],
      })
    }

  ngOnInit(): void {


  }


  campoNoValido(campo: string ){
    return this.login.get(campo)?.invalid
             && this.login.get(campo)?.touched;
  }

  onSubmit() {
   
    this.loginService.login(this.login.value.email,this.login.value.pass ).subscribe({
      next: (resp:any) => {
        if (resp.ok) {

          //TODO: mejorar esta navegacion con los guards y el objeto Usuario que vendra del service
          if(resp.role === 'client') {
            this.router.navigate(['/intranet']);
          } 
          if (resp.role === 'admin') {
              this.router.navigate(['/dashboard-admin']);
          } 
          if (resp.role === 'public') {
            this.router.navigate(['/blog']);
          } 
  
        }else{
          this.router.navigate(['/login']);
        }
      },
      error: err => console.log(err)
    })
  }

}
