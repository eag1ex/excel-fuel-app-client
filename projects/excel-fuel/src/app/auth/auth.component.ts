/**
 * @description We use this component to set our ExcelUser token and update AuthPermissionsService
 * we are only redirected to this component if there is no User/token available
 **/

import { Component, OnDestroy } from '@angular/core'
import { ActivatedRoute,  Router } from '@angular/router';
import { credentials } from '@excel/data';
import { ExcelAuthHttpService } from '@excel/http';
import { ExcelUser } from '@excel/interfaces'
import { AuthPermissionsService } from '@excel/services'
import { of, Observable } from 'rxjs';
import { map, switchMap, first } from 'rxjs/operators';
import { log, onerror, unsubscribe } from 'x-utils-es'

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements  OnDestroy {
  subscriptions = []
    constructor(
      private excelAuthHttpService: ExcelAuthHttpService,
      private router: Router, private route: ActivatedRoute, private authService: AuthPermissionsService) {

        const s0 = this.auth$.subscribe(n => {
          this.reRoute()
        }, error => {
          onerror('auth/error ', error)
          // clear old session
          this.authService.setUser(undefined)
          this.router.navigate(['app/error'], {queryParams: {message: 'Authentication error'}})
        })
        this.subscriptions.push(s0)
    }

    get auth$(){
     return this.authService.user$.pipe(switchMap(n => {
       log('got user from session', n)
       if (!n){

          // make auth call and update response
          const http = (): Observable<ExcelUser> => this.excelAuthHttpService.auth(credentials).pipe(map(x => ({username: credentials.username, token: x?.response?.token, type: 'ADMINISTRATOR'})))

          return http().pipe(map(user => {
            // set new user
            log('setting new user: ', user)
            this.authService.setUser(user)
            return n
          }))
        } else return of(n)
    }), first())
    }

    reRoute(): void{

      // value gets set on the url being asked to load, so if asking from top route, then will follow routing step process instead
      // go to designated location
      if (this.authService.toLocation ){
        this.router.navigate(['app/' + this.authService.toLocation])
        this.authService.toLocation = undefined

      } else{
        this.router.navigate(['app/locations'])
      }
    }

    ngOnDestroy(): void{
      unsubscribe(this.subscriptions, 'AuthComponent')
    }
}
