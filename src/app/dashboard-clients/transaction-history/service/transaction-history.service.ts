import { Injectable } from '@angular/core';

import { environment } from "./../../../../environments/environment";
import { HttpClient, HttpContext } from '@angular/common/http';

import { concat,Observable, throwError, mergeMap} from "rxjs";
import { tap, map, catchError } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class TransactionHistoryService {
  baseUrl = environment.baseUrl

  constructor(
    private http: HttpClient
  ) { }

getTransactions(user_id:string):Observable<any>{
  const url = `${this.baseUrl}transactions/?id=${user_id}`
  console.log(url);
  
  return this.http.get(url).pipe(
    map((resp) =>{
      return resp
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
