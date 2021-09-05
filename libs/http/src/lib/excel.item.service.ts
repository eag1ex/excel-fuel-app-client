/**
 * @description excel/item api calling our excel/server
 */
import { HttpClient } from '@angular/common/http'
import { log, onerror } from 'x-utils-es'
import { Observable, Subject } from 'rxjs'
import { switchMap, timeout, debounceTime, catchError, share, retry, map } from 'rxjs/operators'
import { Inject, Injectable } from '@angular/core'
import { ENV, ExcelItemResp, ExcelModel } from '@excel/interfaces'

@Injectable({
    providedIn: 'root',
})
export class ExcelItemHttpService {
    private apiBaseUrl: string
    sub$: Subject<string> = new Subject()
    constructor(private http: HttpClient, @Inject('ENVIRONMENT') protected ENVIRONMENT: ENV) {
        this.apiBaseUrl = this.ENVIRONMENT.apiBaseUrl
    }

    /**
     * (POST) /api/excel/item/:id
     *  Get one excel station by {id}
     */
    getStation(id: string): Observable<ExcelItemResp> {
        const url = this.apiBaseUrl + `/excel/item/${id}`
        log(`-- calling ${url}`)
        return this.http.get<any>(`${url}`).pipe(retry(1), timeout(10000), retry(1))
    }

    get getStation$(): Observable<ExcelModel> {
        return this.sub$
            .pipe(
                debounceTime(300),
                switchMap((n) => {
                    return this.getStation(n).pipe(map((x) => x.response))
                })
            )
            .pipe(
                catchError((err) => {
                    log('getStation/retry')
                    onerror(err)
                    // do not exit from stream
                    return this.getStation$
                }),
            )
    }
}
