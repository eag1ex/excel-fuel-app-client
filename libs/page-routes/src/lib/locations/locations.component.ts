import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { ExcelModel, ExcelStationsResolver } from '@excel/interfaces'
import { ExcelStates } from '@excel/states'
import { Observable } from 'rxjs/internal/Observable'
import {  map, tap } from 'rxjs/operators'
import { log,  isFalsy } from 'x-utils-es';

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
     * Data update and relay
     * with this implementation we do not need any http/request for latest data, just wait for local updates
     * Latest updated changes of each station on station-map-item (form) are reflected here
     * direction: search > leaflet(component) > station-map-item
     */
    get excelStations$(): Observable<ExcelModel[]>{
        return this.excelStates.updatedStation$.pipe(map(stationItem => {
            const { station} = stationItem || {}

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
