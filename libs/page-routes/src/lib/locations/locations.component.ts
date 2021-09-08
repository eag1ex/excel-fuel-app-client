import { Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { DeletageSteps, ExcelModel, ExcelStationsResolver, LocationEvents, UpdatedStation } from '@excel/interfaces'
import { ExcelStates } from '@excel/states'
import { delegateSteps } from '@excel/utils'
import { fromEvent, Subject } from 'rxjs'
import { Observable } from 'rxjs/internal/Observable'
import { map } from 'rxjs/operators'
import { log, isFalsy, unsubscribe, onerror } from 'x-utils-es'

@Component({
    selector: 'lib-locations',
    templateUrl: './locations.component.html',
    styleUrls: ['./locations.component.scss'],
})
export class LocationsComponent implements OnInit {
    subscriptions = []
    locationEventsSub$: Subject<LocationEvents> = new Subject()
    createStataion: { createOpen: number; addNewID: Date } = {
        createOpen: 0,
        addNewID: undefined,
    }

    excelStationsSnapShot: ExcelStationsResolver
    constructor(private excelStates: ExcelStates, private route: ActivatedRoute) {
        this.excelStationsSnapShot = this.route.snapshot.data?.list as any
    }

    /**
     * Opne and close new create station component controlls
     */
    @ViewChild('createStation')
    set createStation(el: ElementRef & { _elementRef?: ElementRef }) {
        // BUG, for some reason el.nativeElement doesnt work ha?
        if (el?._elementRef) {
            try {
                let elm: HTMLButtonElement = el._elementRef.nativeElement
                let s0 = fromEvent(elm, 'click').subscribe((e) => {
                    if (!this.createStataion.createOpen) {
                        this.createStataion.createOpen++
                        this.createStataion.addNewID = new Date()
                        this.locationEventsSub$.next({ eventName: 'CLOSE_STATION_MAP' })
                    } else {
                        // destroy createStation component
                        this.createStataion.createOpen = 0
                        log('station-map-create/destroyed', this.createStataion.addNewID)
                    }
                })

                this.subscriptions.push(s0)
            } catch (err) {
                onerror('[createStation]', err)
            }
        }
    }

    onDestroyStationComp(addNewID: Date) {
        this.createStataion.createOpen = 0
        log('station-map-create/destroyed', addNewID)
    }

    /**
     * Navigate switch/case steps
     *  - and update excelStationsSnapShot.data
     */
    deletageProcessAndUpdate(stationUpdate: UpdatedStation): void {
        const { station, delete_id } = stationUpdate || {}
        let conditions = delegateSteps(stationUpdate)

        let forSwitch = (condition: DeletageSteps): number => {
            let match = 0
            switch (condition) {
                case 'NEW': {
                    this.excelStationsSnapShot.data.push(station)
                    match = 1
                    break
                }
                case 'UPDATE': {
                    this.excelStationsSnapShot.data = this.excelStationsSnapShot.data.map((n) => {
                        if (n.id === station?.id) n = station
                        return n
                    })
                    match = 1
                    break
                }

                case 'DELETE': {
                    this.excelStationsSnapShot.data.forEach((n, inx) => {
                        if (n.id === delete_id) {
                            this.excelStationsSnapShot.data.splice(inx, 1)
                        }
                    })
                    match = 1
                    break
                }
                default:
                    onerror('no deletageStep matched ?', condition)
            }
            return match
        }

        for (let con of conditions) if (forSwitch(con)) break
    }

    /**
     * Data update and relay
     * with this implementation we do not need any http/request for latest data, just wait for local updates
     * Latest updated changes of each station on station-map-item (form) are reflected here
     * direction: search > leaflet(component) > station-map-item
     */
    get excelStations$(): Observable<ExcelModel[]> {
        return this.excelStates.updatedStation$.pipe(
            map((stationItem) => {
                const { station, delete_id, add_station_id } = stationItem || {}
                if (isFalsy(station) && !delete_id && !add_station_id) {
                    return this.excelStationsSnapShot?.data
                } else {
                    this.deletageProcessAndUpdate(stationItem)
                    return this.excelStationsSnapShot?.data
                }
            })
        )
    }

    ngOnInit(): void {}

    ngOnDestroy(): void {
        unsubscribe(this.subscriptions, 'LocationsComponent')
    }
}
