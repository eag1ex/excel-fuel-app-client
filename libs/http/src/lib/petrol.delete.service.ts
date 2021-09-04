/**
 * @description petrol/delete api calling our pl/server
 */
import { HttpClient } from '@angular/common/http'
import {  log, onerror } from 'x-utils-es'
import { Observable, Subject } from 'rxjs'
import { switchMap, timeout, debounceTime, map, catchError, retry } from 'rxjs/operators'
import { Inject, Injectable } from '@angular/core'
import { ENV, PetrolDeleteResp} from '@pl/interfaces'

@Injectable({
    providedIn: 'root',
})
export class PetrolDeleteHttpService {
    private apiBaseUrl: string
    sub$: Subject<string> = new Subject()
    constructor(private http: HttpClient, @Inject('ENVIRONMENT') protected ENVIRONMENT: ENV) {
        this.apiBaseUrl = this.ENVIRONMENT.apiBaseUrl
    }

    /**
     * (POST) /api/petrol/delete/:id
     * Delete One item by petron product {id}
     */
    delete(id: string): Observable<PetrolDeleteResp> {
        const url = this.apiBaseUrl + `/petrol/delete/${id}`
        log(`-- calling ${url}`)
        return this.http.get<any>(`${url}`).pipe(
            timeout(10000),
            retry(1))
    }

    get delete$(): Observable<Array<string>> {
        return this.sub$
            .pipe(
                debounceTime(300),
                switchMap((n) => {
                    return this.delete(n).pipe(map((x) => x.response))
                })
            )
            .pipe(
                catchError((err) => {
                    onerror(err)
                    // do not exit from stream
                    return this.delete$
                })              )
    }
}
