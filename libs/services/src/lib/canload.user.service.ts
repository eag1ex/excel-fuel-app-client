import { Observable } from 'rxjs'
import { AuthPermissionsService } from './auth.permissions.service'
import { Injectable } from '@angular/core'
import { CanLoad, Route, Router } from '@angular/router'
import { map, tap } from 'rxjs/operators'
import { log } from 'x-utils-es'

@Injectable({
    providedIn: 'root',
})
export class AuthGuardService implements CanLoad {
    constructor(private authService: AuthPermissionsService, private router: Router) {}
    canLoad(route: Route): Observable<boolean> {
      log({route})
      const toLocation: string = route.path
      return this.authService.user$.pipe(
            map((n) => {
                return n?.token !== undefined
            }),
            // re/route to auth and quickly set fake token
            tap(n => {
                if (!n) {
                    this.authService.toLocation = toLocation as any
                    // NO TOKEN AVAILABLE, THEN...
                    // navigate to auth route, make (POST) /api/auth request with hardcoded credentials
                   
                    this.router.navigate(['auth'])
                }
            })
        )
    }
}
