/**
 * @description petrol/location api calling our pl/server, to get static data
 */
import { HttpClient } from '@angular/common/http'
import { log } from 'x-utils-es'
import { Observable, Subject } from 'rxjs'
import { timeout, retry } from 'rxjs/operators'
import { Inject, Injectable } from '@angular/core'
import { ENV, PetrolListResp } from '@pl/interfaces'

@Injectable({
    providedIn: 'root',
})
export class PetrolListHttpService {
    private apiBaseUrl: string
    sub$: Subject<any> = new Subject()
    constructor(private http: HttpClient, @Inject('ENVIRONMENT') protected ENVIRONMENT: ENV) {
        this.apiBaseUrl = this.ENVIRONMENT.apiBaseUrl
    }

    list(): Observable<PetrolListResp> {
        const url = this.apiBaseUrl + `/petrol/list`
        log(`-- calling ${url}`)
        return this.http.get<any>(`${url}`)
        .pipe(
            timeout(10000),
            retry(1)
        )
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

