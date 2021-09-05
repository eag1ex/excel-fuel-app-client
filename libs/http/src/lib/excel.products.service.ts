/**
 * @description excel/products api calling our excel/server, to get static data
 */
import { HttpClient } from '@angular/common/http'
import { log } from 'x-utils-es'
import { Observable, Subject } from 'rxjs'
import { timeout, retry } from 'rxjs/operators'
import { Inject, Injectable } from '@angular/core'
import { ENV, ExcelStationsResp } from '@excel/interfaces'

@Injectable({
    providedIn: 'root',
})
export class ExcelProductsHttpService {
    private apiBaseUrl: string
    sub$: Subject<any> = new Subject()
    constructor(private http: HttpClient, @Inject('ENVIRONMENT') protected ENVIRONMENT: ENV) {
        this.apiBaseUrl = this.ENVIRONMENT.apiBaseUrl
    }

     /**
     * (GET) /api/excel/products
     * list all products from Excel
     */
    products(): Observable<ExcelStationsResp> {
        const url = this.apiBaseUrl + `/excel/products`
        log(`-- calling ${url}`)
        return this.http.get<any>(`${url}`)
        .pipe(
            timeout(10000),
            retry(1)
        )
    }

    // get products$(): Observable<ExcelModel[]> {
    //   return this.sub$.pipe(
    //    // filter(v => !!v),
    //     debounceTime(300),
    //     switchMap(m => {
    //       return this.products(m);
    //     }),
    //     catchError(err => {
    //       onerror(err);
    //       // re/sub on error
    //       return this.list$;
    //     })
    //   );
    // }
}

