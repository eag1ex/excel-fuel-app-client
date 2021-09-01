/**
 * @description Intercept all http trafic, and check for Bearer/token
 */

import { HTTP_INTERCEPTORS, HttpErrorResponse, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { HttpManagerService } from '@pl/utils'

import { Observable, of, throwError } from 'rxjs'
import { catchError, switchMap, timeout } from 'rxjs/operators'
import { log } from 'x-utils-es'

@Injectable()
export class PLhttpInterceptor implements HttpInterceptor {
    constructor(private httpManager: HttpManagerService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
        const headers = {
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Origin': '*',
        }

        // let token;
        // if (this.FAKE_AUTH) {
        // 	token = localStorage.getItem('token'); /// not auth integrated for the moment
        // } else {
        // 	token = null;
        // }

        // const headers = token ? { Authorization: `Bearer ${token}` } : {};

        // if (request.method === 'POST') {
        // 	headers['Content-Type'] = 'application/json;charset=utf-8';
        // }

        request = request.clone({
            url: request.url,
            headers: new HttpHeaders({ ...headers }),
        })

        log('intercept/url', request.url)
        log('intercept/headers', request.headers)
		
        return next.handle(request).pipe(
            switchMap((l) => {
                // if (!token) {
                // 	return throwError('NO_TOKEN, not provided');
                // }
                // if (request.responseType !== 'json' && request.url.indexOf('exportData') === -1) {
                // 	return throwError('responseType not JSON');
                // }
                return of(l)
            }),
            this.httpManager.operators(),
            timeout(10000),
            catchError((error) => this.errorHandler(request.method, error))
        )
    }

    private errorHandler(method: string, error: HttpErrorResponse) {
        const { status } = error
        if (status === 401 || status === 403 || (status === 500 && method === 'GET')) {
            this.httpManager.addErrors(error)
        }
        return throwError(error)
    }
}

export let PLbackendProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: PLhttpInterceptor,
    multi: true,
}
