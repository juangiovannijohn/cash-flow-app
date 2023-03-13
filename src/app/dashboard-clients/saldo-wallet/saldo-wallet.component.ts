import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/public/login/services/login.service';

@Component({
  selector: 'app-saldo-wallet',
  templateUrl: './saldo-wallet.component.html',
  styleUrls: ['./saldo-wallet.component.css']
})
export class SaldoWalletComponent implements OnInit {
get Usuario(){
  return this.loginService.Usuario
}
nombre:any = this.Usuario.email
saldo:any = this.Usuario.id

  constructor(
    private loginService:LoginService
  ) { }

  ngOnInit(): void {
    console.log(this.Usuario)
  }

}
