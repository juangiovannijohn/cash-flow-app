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

    //TODO: encadenar 2 observables para llenar el objeto de usuario correctamente
  //  this.getUsers('juan@juan.com').pipe(
  //   mergeMap( (res:any) => 
  //     this.userMeta(res.id))
  //  ).subscribe({
  //   next: userMetadata => console.log('')
  //  })

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
    const url = `${this.baseUrl}users`
    const urlDev = `${this.baseUrl}usuario_prueba`
    console.log(urlDev)
    return this.http.get(urlDev).pipe(
      map((resp:any) =>{

        if (resp.email === email && resp.pass === pass) {
          this._usuario = resp
          localStorage.setItem('usuario', JSON.stringify(this._usuario))
          return {
            ok: true,
            role: resp.role
          }
        }else{
          return {
            ok: false,
            role: undefined
          }
        }

        //TODO: todo esto debe venir del back
        // const respArr = Object.values(resp);
        // const user:any = respArr.find( ( item:any ) => item.email == email  )
        // if (user && (user.pass === pass)) {
        //   //hacer en el back
        //   this._usuario = {
        //     id: user.id,
        //     email: user.email,
        //     role: user.role
        //   }
        //   localStorage.setItem('usuario', JSON.stringify(this._usuario))

        // }

      }),
      catchError(this.handleError)
    )
  }

  private handleError(error: Response){
    console.warn(error);
    const msg = `Error status code:${error.status}, status ${error.statusText}`;
    return throwError(msg);
  }


}
