/**
 * @description excel/create api calling our excel/server
 */
import { HttpClient } from '@angular/common/http'
import { isFunction, log, onerror } from 'x-utils-es'
import { Observable, Subject } from 'rxjs'
import { switchMap, timeout, debounceTime, catchError, retry, map } from 'rxjs/operators'
import { Inject, Injectable } from '@angular/core'
import { CreateErrorCallback, ENV, ExcelItemResp, ExcelModel } from '@excel/interfaces'

@Injectable({
    providedIn: 'root',
})
export class ExcelCreateHttpService {
    private apiBaseUrl: string
    sub$: Subject<ExcelModel> = new Subject()
    constructor(private http: HttpClient, @Inject('ENVIRONMENT') protected ENVIRONMENT: ENV) {
        this.apiBaseUrl = this.ENVIRONMENT.URI ? this.ENVIRONMENT.URI + `/${this.ENVIRONMENT.apiBaseUrl}` : this.ENVIRONMENT.apiBaseUrl
    }

    /**
     * (POST) /api/excel/create
     * Create new excel station when providing {ExcelModel}, excluding {created_at,updated_at,id}
     * Checks for same latitude/longitude, or address/city
     */
    create(inputData: ExcelModel): Observable<ExcelItemResp> {
        const url = this.apiBaseUrl + `/excel/create`
        log(`-- calling ${url}`)
        return this.http.post<any>(`${url}`, JSON.stringify(inputData)).pipe(timeout(10000), retry(1))
    }

    create$(error?: CreateErrorCallback): Observable<ExcelModel> {
        return this.sub$
            .pipe(
                debounceTime(300),
                switchMap((n) => {
                    return this.create(n).pipe(map((x) => x.response))
                })
            )
            .pipe(
                catchError((err) => {
                    if (isFunction(error)) error(err)
                    onerror(err)
                    // do not exit from stream
                    return this.create$(error)
                })
            )
    }
}
