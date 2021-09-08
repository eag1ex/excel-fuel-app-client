import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router'
import { ExcelStationsHttpService } from '@excel/http'
import { ExcelStationsResolver } from '@excel/interfaces'
import { currentRoute } from '@excel/utils'
import { Observable, throwError } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { onerror } from 'x-utils-es'

@Injectable({
    providedIn: 'root',
})
export class ExcelStationsServiceResolver implements Resolve<ExcelStationsResolver> {
    constructor(private excelListHttpService: ExcelStationsHttpService, private router: Router) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ExcelStationsResolver> {
        return this.excelListHttpService
            .stations()
            .pipe(map((n) => ({ data: n.response, ...(currentRoute('locations') || {}) })))
            .pipe(
                catchError((err) => {
                    onerror(err)
                    this.router.navigate(['app/error'], { queryParams: { message: 'Authentication error, or session cleared. Try loading app/ again' } })
                    return throwError(err)
                })
            ) as Observable<ExcelStationsResolver>
    }
}
