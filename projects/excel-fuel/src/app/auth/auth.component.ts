/**
 * @description We use this component to set our PLUser token and update AuthPermissionsService
 * we are only redirected to this component if there is no User/token available
 **/

import { Component, OnInit } from '@angular/core'
import { ActivatedRoute,  Router } from '@angular/router';
import { PLUser } from '@excel/interfaces'
import { AuthPermissionsService } from '@excel/services'
import { log } from 'x-utils-es'

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
    constructor(private router: Router, private route: ActivatedRoute, private authService: AuthPermissionsService) {
        log('userSnapShotdata?', this.userSnapShotdata)
        this.reRoute()
    }

    /** set user and reroute */
    reRoute(): void{
      const user: PLUser = {
        username: 'johndoe',
        // we will change that to match with server token
        token: '3455465656fgffgh',
        type: 'ADMINISTRATOR'
      }
      this.authService.setUser(user)

      // value gets set on the url being asked to load, so if asking from top route, then will follow routing step process instead
      // go to designated location
      if (this.authService.toLocation ){
        this.router.navigate(['app/' + this.authService.toLocation])
        this.authService.toLocation = undefined

      } else{
        this.router.navigate(['app/locations'])
      }


    }

    get userSnapShotdata(): { user: PLUser } {
        return this.route.snapshot.data as any
    }

    ngOnInit(): void {}
}
