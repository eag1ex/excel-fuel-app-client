

import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router'
import { PetrolListHttpService } from '@pl/http'
import { PetrolListResolver } from '@pl/interfaces'
import { currentRoute } from '@pl/utils'

import { Observable, throwError } from 'rxjs'
import { catchError,  map } from 'rxjs/operators'
import { onerror } from 'x-utils-es'


@Injectable({
    providedIn: 'root',
})
export class PetrolListServiceResolver implements Resolve<PetrolListResolver> {
    constructor(private petrolListHttpService: PetrolListHttpService, private router: Router) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<PetrolListResolver> {
        return this.petrolListHttpService.list()
            .pipe(
                map(n => ({data: n.response, ...(currentRoute('locations') || {})}))
            ).pipe(catchError((err) => {
                onerror(err)
                this.router.navigate(['app/error'])
                return throwError(err)
            })) as Observable<PetrolListResolver>

    }
}
