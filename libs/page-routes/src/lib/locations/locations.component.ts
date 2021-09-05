import { Component, OnDestroy, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { ExcelModel, ExcelStationsResolver } from '@excel/interfaces'
import { ExcelStates } from '@excel/states'
import { Observable } from 'rxjs/internal/Observable'
import { filter, first, map, tap } from 'rxjs/operators'
import { log, unsubscribe, isFalsy } from 'x-utils-es';

@Component({
    selector: 'lib-locations',
    templateUrl: './locations.component.html',
    styleUrls: ['./locations.component.scss'],
})
export class LocationsComponent implements OnInit {
    excelStationsSnapShot: ExcelStationsResolver
    constructor(private excelStates: ExcelStates, private route: ActivatedRoute) {
        this.excelStationsSnapShot = this.route.snapshot.data?.list as any
    }

    /**
     *
     * with this implementation we do not need any http/request for latest data, just wait for local updates
     */
    get excelStations$(): Observable<ExcelModel[]>{
        return this.excelStates.updatedStation$.pipe(map(station => {
            if (isFalsy(station)) return this.excelStationsSnapShot?.data
            else{
                return this.excelStationsSnapShot.data = this.excelStationsSnapShot.data.map((n) => {
                    if (n.id === station.id)  n = station
                    return n
                })
            }
        })).pipe(tap(n => {
                log('excelStations$ update', n)
        }))
    }

    ngOnInit(): void {}

}
