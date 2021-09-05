import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { ExcelListResolver } from '@excel/interfaces'
import { log } from 'x-utils-es'

@Component({
    selector: 'lib-locations',
    templateUrl: './locations.component.html',
    styleUrls: ['./locations.component.scss'],
})
export class LocationsComponent implements OnInit {
    constructor(private route: ActivatedRoute) {
      log({excelListSnapShot: this.excelListSnapShot})
    }


    get excelListSnapShot(): ExcelListResolver {
        return this.route.snapshot.data?.list as any
    }

    ngOnInit(): void {}
}
