/**
 * @description We use this component to set our PLUser token and update AuthPermissionsService
 * we are only redirected to this component if there is no User/token available
 **/

import { Component, OnInit } from '@angular/core'
import { ActivatedRoute,  Router } from '@angular/router';
import { PLUser } from '@pl/interfaces'
import { AuthPermissionsService } from '@pl/services'
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
      this.router.navigate(['app/locations'])
    }

    get userSnapShotdata(): { user: PLUser } {
        return this.route.snapshot.data as any
    }

    ngOnInit(): void {}
}
