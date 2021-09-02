

import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router'
import { PetrolHttpService } from '@pl/http'
import { PetrolListResolver } from '@pl/interfaces'
import { currentRoute } from '@pl/utils'

import { Observable, throwError } from 'rxjs'
import { catchError,  map, retry, timeout } from 'rxjs/operators'
import { onerror } from 'x-utils-es'


@Injectable({
    providedIn: 'root',
})
export class PetrolServiceResolver implements Resolve<PetrolListResolver> {
    constructor(private petrolHttpService: PetrolHttpService, private _router: Router) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<PetrolListResolver> {

        return this.petrolHttpService.list(undefined)
            .pipe(
                map(n => ({data: n.response, ...(currentRoute('locations') || {})})),
                catchError((err) => {
                    // this._router.navigate([`app/error`], {queryParams: {message, route: ERROR_MESSAGES.CONSTITUTION.message} })
                    onerror('[petrolHttpService]', err)
                    return throwError(err)
                })
            )
            .pipe(retry(1)) as Observable<PetrolListResolver>

    }
}
