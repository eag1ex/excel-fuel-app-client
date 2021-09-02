/**
* @description petrol/location api calling our pl/server, to get static data
*/
import { HttpClient } from '@angular/common/http';
import {  isEmpty, isFalsy, log, onerror } from 'x-utils-es';
import {  from, Observable, Subject, throwError,  of } from 'rxjs';
import { switchMap,  timeout, debounceTime, catchError, filter, first, share } from 'rxjs/operators';
import { Inject, Injectable } from '@angular/core';
import { ENV, PetrolModel } from '@pl/interfaces';
import { PetrolListResp } from 'libs/interfaces/src/lib/http.interface';


@Injectable({
    providedIn: 'root',
})
export class PetrolHttpService {
    private apiBaseUrl: string;
    sub$: Subject<any> = new Subject();
    constructor(
      private http: HttpClient, @Inject('ENVIRONMENT') protected ENVIRONMENT: ENV) {
      this.apiBaseUrl = this.ENVIRONMENT.apiBaseUrl;
    }

   list(params: any): Observable<PetrolListResp> {

        // if (isEmpty(params)) { params = {} }

        const url = this.apiBaseUrl + `/petrol/list`
        log(`-- calling ${url}`)
        return this.http.get<any>(`${url}`).pipe( timeout(10000))

    }

    // get list$(): Observable<PetrolModel[]> {
    //   return this.sub$.pipe(
    //    // filter(v => !!v),
    //     debounceTime(300),
    //     switchMap(m => {
    //       return this.list(m);
    //     }),
    //     catchError(err => {
    //       onerror(err);
    //       // re/sub on error
    //       return this.list$;
    //     })
    //   );
    // }
}
