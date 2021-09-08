/**
 * @description excel/update api calling our excel/server, to get static data
 */
import { HttpClient } from '@angular/common/http'
import { isFalsy, isFunction, log, onerror } from 'x-utils-es'
import { Observable, Subject, throwError } from 'rxjs'
import { switchMap, timeout, debounceTime, catchError, retry, map } from 'rxjs/operators'
import { Inject, Injectable } from '@angular/core'
import { CreateErrorCallback, ENV, ExcelItemResp, ExcelModel } from '@excel/interfaces'

@Injectable({
    providedIn: 'root',
})
export class ExcelUpdateHttpService {
    private apiBaseUrl: string
    sub$: Subject<{ id: string; data: ExcelModel }> = new Subject()
    constructor(private http: HttpClient, @Inject('ENVIRONMENT') protected ENVIRONMENT: ENV) {
        this.apiBaseUrl = this.ENVIRONMENT.apiBaseUrl
    }

    /**
     * (POST) /api/excel/update/:id
     * Update existing excel station by {id} with details: {price,name}, accepting: {price,name,product_id}
     */
    update(id: string, d: ExcelModel): Observable<ExcelItemResp> {
        if (isFalsy(d)) return throwError('no data provided for update')
        const url = this.apiBaseUrl + `/excel/update/${id}`
        log(`-- calling ${url}`)
        log('sending data',d)
        return this.http.post<any>(`${url}`, JSON.stringify(d)).pipe(  timeout(10000), retry(1))
    }

    update$(error?:CreateErrorCallback): Observable<ExcelModel> {
        return this.sub$
            .pipe(
                debounceTime(300),
                switchMap((n) => {
                    return this.update(n.id, n.data).pipe(map((x) => x.response))
                })
            )
            .pipe(
                catchError((err) => {
                    if(isFunction(error)) error(err)
                    onerror(err)
                    // do not exit from stream
                    return this.update$(error)
                }),
            )
    }
}
