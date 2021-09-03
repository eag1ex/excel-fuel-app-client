import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { PetrolListResolver } from '@pl/interfaces'
import { log } from 'x-utils-es'

@Component({
    selector: 'lib-locations',
    templateUrl: './locations.component.html',
    styleUrls: ['./locations.component.scss'],
})
export class LocationsComponent implements OnInit {
    constructor(private route: ActivatedRoute) {
      log({petrolListSnapShot: this.petrolListSnapShot})
    }


    get petrolListSnapShot(): PetrolListResolver {
        return this.route.snapshot.data?.list as any
    }

    ngOnInit(): void {}
}
