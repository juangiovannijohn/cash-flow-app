import { Injectable } from '@angular/core';

import { environment } from "./../../../../environments/environment";
import { HttpClient } from '@angular/common/http';

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

getTransactions(user_id:number):Observable<any>{
  const url = `${this.baseUrl}transactions`
  console.log(url);
  return this.http.get(url).pipe(
    map((resp) =>{
      //TODO: todo esto debe venir del back
      const respArr = Object.values(resp);
      const transactions = respArr.filter( ( item:any ) => item.user_id == user_id 
        );
      return transactions
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
