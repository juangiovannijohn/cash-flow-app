import { Injectable } from '@angular/core';
import { concat,Observable, throwError, mergeMap} from "rxjs";
import { HttpClient } from '@angular/common/http';
import { tap, map, catchError } from "rxjs/operators";
import { ajax } from "rxjs/ajax";
import { environment } from "./../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class LoginService {
baseUrl = environment.baseUrl
_usuario: any = ''

  constructor(private http: HttpClient) {
   }

  get Usuario(){
    if (!this._usuario) {
      const usuarioLocal = localStorage.getItem('usuario');
      if (usuarioLocal) {
        this._usuario = JSON.parse(usuarioLocal);
      }
    }
    return { ...this._usuario };
  }





  // getUsers(email:string):Observable<any> {
  //   const url = `${this.baseUrl}users`
  //   console.log(url)
  //   const users = ajax.getJSON(url);
  //   const data$ = new Observable(obs => {

  //     users.subscribe({
  //      next: (res:any) => {
  //       const user = res.find((item:any) => item.email === email)
  //       //hacer en el back
  //       this._usuario = {
  //         id: user.id,
  //         email: user.email,
  //         role: user.role
  //       }
  //       localStorage.setItem('usuario', JSON.stringify(this._usuario));
  //         obs.next(user),
  //         obs.complete()
  //       },
  //       error: (err)=> {
  //         obs.error(err)
  //       }
  //     })
  //   })
  //   return data$;
  // }

  
  // userMeta(id:number){

  //   const url =  `${this.baseUrl}users_meta`
  //   console.log(url)
  //   const users_meta = ajax.getJSON(url);
  //   const data$ = new Observable(obs => {

  //     users_meta.subscribe({
  //      next: (res:any) => {
  //       const meta_data = res.find((item:any) => item.user_id === id)
        
  //       this._usuario = {... this._usuario, meta_data  },
  //       localStorage.setItem('usuario', JSON.stringify(this._usuario));
  //         obs.next(meta_data),
  //         obs.complete()
  //       },
  //       error: (err)=> {
  //         obs.error(err)
  //       }
  //     })
  //   })
  //   return data$;
  // }
  
  login(email:string, pass:string){
    const url = `${this.baseUrl}users/login`
    const body = {
      email,
      password: pass
    }
    console.log(url)
    return this.http.post(url, body).pipe(
      map((resp:any) =>{
        if (resp.ok) {
          this._usuario = resp.user
          localStorage.setItem('usuario', JSON.stringify(resp.user))
        };
        return resp
      }),
      catchError(this.handleError)
    )
  }

  private handleError(error: Response){
    console.warn(error);
    const err = {
      ok: error.ok,
      msg: `Error status code:${error.status}, status ${error.statusText}`
    }
    return throwError(err);
  }


}
