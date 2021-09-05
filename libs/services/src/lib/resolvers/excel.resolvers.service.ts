

import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router'
import { ExcelListHttpService } from '@excel/http'
import { ExcelListResolver } from '@excel/interfaces'
import { currentRoute } from '@excel/utils'

import { Observable, throwError } from 'rxjs'
import { catchError,  map } from 'rxjs/operators'
import { onerror } from 'x-utils-es'


@Injectable({
    providedIn: 'root',
})
export class ExcelListServiceResolver implements Resolve<ExcelListResolver> {
    constructor(private excelListHttpService: ExcelListHttpService, private router: Router) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ExcelListResolver> {
        return this.excelListHttpService.list()
            .pipe(
                map(n => ({data: n.response, ...(currentRoute('locations') || {})}))
            ).pipe(catchError((err) => {
                onerror(err)
                this.router.navigate(['app/error'])
                return throwError(err)
            })) as Observable<ExcelListResolver>

    }
}
