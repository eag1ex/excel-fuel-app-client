/**
 * @description petrol/create api calling our pl/server
 */
import { HttpClient } from '@angular/common/http'
import { log, onerror } from 'x-utils-es'
import { Observable, Subject} from 'rxjs'
import { switchMap, timeout, debounceTime, catchError, retry, map } from 'rxjs/operators'
import { Inject, Injectable } from '@angular/core'
import { ENV,  PetrolItemResp, PetrolModel } from '@pl/interfaces'

@Injectable({
    providedIn: 'root',
})
export class PetrolCreateHttpService {
    private apiBaseUrl: string
    sub$: Subject<PetrolModel> = new Subject()
    constructor(private http: HttpClient, @Inject('ENVIRONMENT') protected ENVIRONMENT: ENV) {
        this.apiBaseUrl = this.ENVIRONMENT.apiBaseUrl
    }

    /**
     * (POST) /api/petrol/create
     * Create new petrol station when providing {PetrolModel}, excluding {created_at,updated_at,id}
     * Checks for same latitude/longitude, or address/city
     */
    create(inputData: PetrolModel): Observable<PetrolItemResp> {
        const url = this.apiBaseUrl + `/petrol/create`
        log(`-- calling ${url}`)
        return this.http.post<any>(`${url}`, JSON.stringify(inputData)).pipe(
            timeout(10000),
            retry(1))
    }

    get create$(): Observable<PetrolModel> {
        return this.sub$
            .pipe(
                debounceTime(300),
                switchMap((n) => {
                    return this.create(n).pipe(map((x) => x.response))
                })
            )
            .pipe(
                catchError((err) => {
                    onerror(err)
                    // do not exit from stream
                    return this.create$
                }),
            )
    }
}

