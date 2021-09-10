import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { DeletageSteps, ExcelModel, ExcelStationsResolver, LocationEvents, UpdatedStation } from '@excel/interfaces'
import { LeafletComponent } from '@excel/plugins'
import { ExcelStates } from '@excel/states'
import { delegateSteps } from '@excel/utils'
import { fromEvent, Subject } from 'rxjs'
import { Observable } from 'rxjs/internal/Observable'
import { map } from 'rxjs/operators'
import { log, isFalsy, unsubscribe, onerror, delay } from 'x-utils-es';

@Component({
    selector: 'lib-locations',
    templateUrl: './locations.component.html',
    styleUrls: ['./locations.component.scss'],
})
export class LocationsComponent implements OnInit, OnDestroy {
    subscriptions = []
    locationEventsSub$: Subject<LocationEvents> = new Subject()
    createStataion: { createOpen: number; addNewID: Date } = {
        createOpen: 0,
        addNewID: undefined,
    }

    excelStationsSnapShot: ExcelStationsResolver
    constructor(
        private CDR: ChangeDetectorRef,
        private excelStates: ExcelStates, private route: ActivatedRoute) {
        this.excelStationsSnapShot = this.route.snapshot.data?.list as any
    }

    /** gain access to leaflet component, we can make exxecutions within */
    @ViewChild('leaflet') leaflet: LeafletComponent

    /**
     * Opne and close new create station component controlls
     */
    @ViewChild('createStation')
    set createStation(el: ElementRef & { _elementRef?: ElementRef }) {
        // BUG, for some reason el.nativeElement doesnt work ha?
        if (el?._elementRef) {
            try {
                const elm: HTMLButtonElement = el._elementRef.nativeElement
                const s0 = fromEvent(elm, 'click').subscribe((e) => {
                    if (!this.createStataion.createOpen) {
                        this.closeOpenLeafletMapMarkers()
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

    /**  from gained access to leaflet component, we can now accep leaflet markers, nice!! */
    closeOpenLeafletMapMarkers(){
        if(this.leaflet){
            this.leaflet.markerHistory.forEach(({m})=>{
                try{
                    m.closePopup()
                }catch(err){

                }         
            })
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
        const conditions = delegateSteps(stationUpdate)

        const forSwitch = (condition: DeletageSteps): number => {
            let match = 0
            switch (condition) {

                case 'CANCEL': {
                   
                    // if we clicked on item market to opne update component
                    // close create statation component if its open
                    this.createStataion.createOpen = 0
                    this.CDR.detectChanges()
                    match = 1
                    break
                }

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

        for (const con of conditions) if (forSwitch(con)) break
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
       
                const { station, delete_id, add_station_id, close_create_stataion } = stationItem || {}
                if (isFalsy(station) && !delete_id && !add_station_id && !close_create_stataion) {
                    return this.excelStationsSnapShot?.data
                } else {
                    this.deletageProcessAndUpdate(stationItem)
                    return this.excelStationsSnapShot?.data
                }
            })
        )
    }

    ngOnInit(): void {
 
    }

    ngOnDestroy(): void {
        unsubscribe(this.subscriptions, 'LocationsComponent')
    }
}
