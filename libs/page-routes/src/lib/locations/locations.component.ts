import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { ExcelModel, ExcelStationsResolver } from '@excel/interfaces'
import { ExcelStates } from '@excel/states'
import { filter } from 'rxjs/operators'
import { log } from 'x-utils-es'

@Component({
    selector: 'lib-locations',
    templateUrl: './locations.component.html',
    styleUrls: ['./locations.component.scss'],
})
export class LocationsComponent implements OnInit {
    excelStationsSnapShot: ExcelStationsResolver
    excelStations: ExcelModel[]
    constructor(private excelStates: ExcelStates, private route: ActivatedRoute) {
        this.excelStationsSnapShot = this.route.snapshot.data?.list as any
        this.excelStations = this.excelStationsSnapShot.data

        //
        this.excelStates.updatedStation$.pipe(filter((n) => !!n)).subscribe((n) => {
            this.updateStations(n)
        })
    }

    /**
     * with this implementation we do not need any re/request for latest data, just update localy
     */
    updateStations(station: ExcelModel): void {
        if (!station) return
        let updated = false
        this.excelStations = this.excelStations.map((n) => {
            if (n.id === station.id) {
                n = station
                updated = true
            }
            return n
        })
        this.excelStationsSnapShot.data = this.excelStations
        if (updated) {
            log('[updateStations]', 'excelStations updated')
        }
    }

    ngOnInit(): void {}
}
