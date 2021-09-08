/**
 * @description Intercept all http trafic, and check for Bearer/token
 */

import { HTTP_INTERCEPTORS, HttpErrorResponse, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { HttpManagerService, localStorageGetUser } from '@excel/utils'
import { Observable, of, throwError } from 'rxjs'
import { catchError, switchMap, timeout } from 'rxjs/operators'
import { log } from 'x-utils-es'

@Injectable()
export class PLhttpInterceptor implements HttpInterceptor {
    constructor(private httpManager: HttpManagerService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
        const user = localStorageGetUser('excel-user')
        const headers = {
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Origin': '*',
            ...(request.method === 'POST' ? { ['Content-Type']: 'application/json;charset=utf-8' } : {}),
            //  NOTE  check for token on all routes except for /auth
            ...(user?.token && !request.url.includes('/auth') ? { Authorization: `Bearer ${user?.token}` } : {}),
        }

        request = request.clone({
            url: request.url,
            headers: new HttpHeaders({ ...headers }),
        })

        log('intercept/url', request.url)

        return next.handle(request).pipe(
            switchMap((n) => of(n)),
            this.httpManager.operators(),
            timeout(10000),
            catchError((error) => this.errorHandler(request.method, error))
        )
    }

    private errorHandler(method: string, err: HttpErrorResponse) {
        const { status, error } = err
        // clear old token on this error
        if (error?.code === '000') localStorage.removeItem('excel-user')

        if (status === 401 || status === 403 || (status === 500 && method === 'GET')) {
            this.httpManager.addErrors(err)
        }

        return throwError(err)
    }
}

export let PLbackendProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: PLhttpInterceptor,
    multi: true,
}
