/**
 * @description petrol/item api calling our pl/server
 */
import { HttpClient } from '@angular/common/http'
import { log, onerror } from 'x-utils-es'
import { Observable, Subject } from 'rxjs'
import { switchMap, timeout, debounceTime, catchError, share, retry, map } from 'rxjs/operators'
import { Inject, Injectable } from '@angular/core'
import { ENV, PetrolItemResp, PetrolModel } from '@pl/interfaces'

@Injectable({
    providedIn: 'root',
})
export class PetrolItemHttpService {
    private apiBaseUrl: string
    sub$: Subject<string> = new Subject()
    constructor(private http: HttpClient, @Inject('ENVIRONMENT') protected ENVIRONMENT: ENV) {
        this.apiBaseUrl = this.ENVIRONMENT.apiBaseUrl
    }

    /**
     * (POST) /api/petrol/item/:id
     *  Get one petron station by {id}
     */
    getStation(id: string): Observable<PetrolItemResp> {
        const url = this.apiBaseUrl + `/petrol/item/${id}`
        log(`-- calling ${url}`)
        return this.http.get<any>(`${url}`).pipe(retry(1), timeout(10000), retry(1))
    }

    get getStation$(): Observable<PetrolModel> {
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
