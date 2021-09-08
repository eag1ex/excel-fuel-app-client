/**
 * @description excel/update api calling our excel/server, to get static data
 */
import { HttpClient } from '@angular/common/http'
import { isFalsy, log } from 'x-utils-es'
import { Observable, throwError } from 'rxjs'
import { timeout, retry, catchError } from 'rxjs/operators'
import { Inject, Injectable } from '@angular/core'
import { AuthCreds, AuthResp, ENV } from '@excel/interfaces'

@Injectable({
    providedIn: 'root',
})
export class ExcelAuthHttpService {
    private apiBaseUrl: string
    constructor(private http: HttpClient, @Inject('ENVIRONMENT') protected ENVIRONMENT: ENV) {
        this.apiBaseUrl = this.ENVIRONMENT.apiBaseUrl
    }

    /**
     * (POST) /api/auth/
     *  Generate new {token}, with body details: {username,password}
     */
    auth(creds: AuthCreds): Observable<AuthResp> {
        if (isFalsy(creds)) return throwError('no creds provided for auth')
        const url = this.apiBaseUrl + `/auth`
        log(`-- calling ${url}`)
        return this.http
            .post<any>(`${url}`, JSON.stringify(creds))
            .pipe(timeout(10000), retry(1))
            .pipe(
                catchError((err) => {
                    onerror('[auth]', err)
                    return throwError(err)
                })
            )
    }
}
