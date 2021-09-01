import { HttpErrorResponse, HttpEvent } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { RouteConfigLoadEnd, RouteConfigLoadStart, Router } from '@angular/router'
import { Observable, pipe, Subject } from 'rxjs'
import { debounceTime, distinctUntilChanged, finalize, map, tap } from 'rxjs/operators'
import { HttpActiveConnectionSubject } from './http-active-connection-subject'

/**
 * HttpManagerService
 *
 * Provide data about http status uses all over the app
 * It watch all http client call (via interceptor) and watch router for lazy loading module
 *
 * Maybe, we can try implementing http concurrency control here as well
 */
@Injectable({
    providedIn: 'root',
})
export class HttpManagerService {
    statusChanges: Observable<boolean>

    private _active$ = new HttpActiveConnectionSubject()
    private errors = new Subject<HttpErrorResponse>()

    constructor(private _router: Router) {
        this.statusChanges = this._getStatusChanges()
        this._watchLazyLoad()
    }

    public addErrors = (errors: HttpErrorResponse): void => this.errors.next(errors)

    public getErrors = () => this.errors.asObservable()

    operators() {
        return pipe(
            tap((e: HttpEvent<any>) => e.type || this._active$.up()),
            finalize(() => this._active$.down())
        )
    }

    private _watchLazyLoad() {
        this._router.events.subscribe((event) => {
            if (event instanceof RouteConfigLoadStart) {
                this._active$.up()
            } else if (event instanceof RouteConfigLoadEnd) {
                this._active$.down()
            }
        })
    }

    /**
     * Map activeConnection to status (active or inactive) present in boolean
     * The returning stream is debounced to prevent unneccessary emitting
     */
    private _getStatusChanges(): Observable<boolean> {
        /// using local mocking server so fake loading time
        return this._active$.asObservable().pipe(
            map((count) => count > 0),
            debounceTime(100),
            distinctUntilChanged()
        )
    }
}
