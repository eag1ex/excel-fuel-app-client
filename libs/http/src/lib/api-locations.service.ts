/**
* @description petrol/location api calling our pl/server, to get static data
*/
import { HttpClient } from '@angular/common/http';
import {  isEmpty, isFalsy, log, onerror } from 'x-utils-es';
import {  from, Observable, Subject, throwError,  of } from 'rxjs';
import { switchMap,  timeout, debounceTime, catchError, filter, first, share } from 'rxjs/operators';
import { Inject, Injectable } from '@angular/core';
import { ENV } from '@pl/interfaces';
// import { ParallelHttpService } from '../../parallel-http.service';


@Injectable({
    providedIn: 'root',
})
export class ConstitutionHttpService {
    private apiBaseUrl: string;
    sub$: Subject<any> = new Subject();
    constructor(
      private http: HttpClient, @Inject('ENVIRONMENT') protected ENVIRONMENT: ENV) {
      this.apiBaseUrl = this.ENVIRONMENT.apiBaseUrl;
    }

   locationList(params: any): Observable<any> {

        // if (isEmpty(params)) { params = {} }

        const url = this.apiBaseUrl + `/petrol/locations`
        log(`-- calling ${url}`)
        return this.http.get<any>(`${url}`).pipe( timeout(10000))

    }

    get locationList$(): Observable<any[]> {
      return this.sub$.pipe(
       // filter(v => !!v),
        debounceTime(300),
        switchMap(m => {
          return this.locationList(m);
        }),
        catchError(err => {
          onerror(err);
          // re/sub on error
          return this.locationList$;
        })
      );
    }
}
