import { Observable } from 'rxjs'
import { AuthPermissionsService } from './auth.permissions.service'

import { Injectable } from '@angular/core'
import { CanLoad, Route, Router } from '@angular/router'
import { map, tap } from 'rxjs/operators'

@Injectable({
    providedIn: 'root',
})
export class AuthGuardService implements CanLoad {
    constructor(private authService: AuthPermissionsService, private router: Router) {}
    canLoad(route: Route): Observable<boolean> {
        return this.authService.user$.pipe(
            map((n) => {
                return n?.token !== undefined
            }),
            // re/route to auth and quickly set fake token
            tap(n => {
                if (!n) this.router.navigate(['app/auth'])
            })
        )
    }
}
