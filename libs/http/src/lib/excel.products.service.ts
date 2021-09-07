/**
 * @description excel/products api calling our excel/server, to get static data
 */
import { HttpClient } from '@angular/common/http'
import { isFalsy, log } from 'x-utils-es'
import { from, Observable, of, Subject } from 'rxjs'
import { timeout, retry, switchMap, map, first } from 'rxjs/operators';
import { Inject, Injectable } from '@angular/core'
import { ENV, ExcelProductsResp } from '@excel/interfaces'
import { ExcelStates } from '@excel/states';

@Injectable({
    providedIn: 'root',
})
export class ExcelProductsHttpService {
    private apiBaseUrl: string
    constructor(
       private states: ExcelStates,
       private http: HttpClient, @Inject('ENVIRONMENT') protected ENVIRONMENT: ENV) {
        this.apiBaseUrl = this.ENVIRONMENT.apiBaseUrl
    }

     /**
     * (GET) /api/excel/products
     * - list all products from Excel
     * - Products do not change so can be cached frequently
     */
    products(): Observable<ExcelProductsResp> {
        const url = this.apiBaseUrl + `/excel/products`
        log(`-- calling ${url}`)

        const http = (): Observable<ExcelProductsResp> => this.http.get<any>(`${url}`).pipe(
            timeout(10000),
            retry(1)
        )

        return from(this.states.excelProducts$).pipe(switchMap(n => {
            if (isFalsy(n)) return http().pipe(map(d => {
                this.states.setExcelProducts(d)
                return d
            }));
            else return of({response: n, code: 200})
        })).pipe(first())

    }
}

