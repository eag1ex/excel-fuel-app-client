import { ElementRef, ViewChild, OnDestroy } from '@angular/core'
import { Component, OnInit, AfterViewInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { EUROPE_LAT_LNG } from '@excel/data'
import { ExcelModel, LatLng, SelectedMapItem } from '@excel/interfaces'
import { latLong, makeMarkerPopUp } from '@excel/utils'
import { map, tileLayer, icon, marker, Marker, Map, Icon, MapOptions, IconOptions } from 'leaflet'
import { log, sq, onerror, isFalsy, unsubscribe } from 'x-utils-es'

import { Subject } from 'rxjs'
import { filter, debounceTime, delay as rxDelay } from 'rxjs/operators'
import { ExcelStates } from '@excel/states'

interface TargetOptions {
    draggable?: boolean
    title?: string
    data: ExcelModel
    opacity?: number
    icon?: Icon
}

const iconUrlSelected = 'libs/theme/assets/icons/local_gas_station_yellow_24dp.svg'
const iconUrl = 'libs/theme/assets/icons/local_gas_station_blue_24dp.svg'
const iconDefault = icon({
    //  iconRetinaUrl,
    iconUrl,
    // shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41],
})
Marker.prototype.options.icon = iconDefault

@Component({
    selector: 'lib-leaflet',
    templateUrl: './leaflet.component.html',
    styleUrls: ['./leaflet.component.scss'],
})
export class LeafletComponent implements OnInit, AfterViewInit, OnDestroy {
    subscriptions = []
    subSelect$: Subject<TargetOptions & { status: 'OPEN' | 'CLOSE' } & { marker: Marker }> = new Subject()

    private _mapFrame: ElementRef
    mapReady = sq()
    selectedMapItem: SelectedMapItem
    private map: Map & { enablePopup?: boolean }
    markerHistory: Array<{ m: Marker; id: string }> = []
    constructor(private states: ExcelStates, private route: ActivatedRoute) {
        const s0 = this.subSelect$
            .pipe(
                debounceTime(500),
                filter((n) => !isFalsy(n))
            )
            .subscribe((n) => {
                if (n.status === 'CLOSE') {
                    this.selectedMapItem = undefined
                } else {
                    this.selectedMapItem = { station: n.data, marker: n.marker }
                    log('selected', this.selectedMapItem)
                }
            })

        this.subscriptions.push(s0)
    }

    @ViewChild('mapFrame')
    set mapFrame(el: ElementRef) {
        if (el) {
            this.mapReady.resolve(true)
            this._mapFrame = el
        }
    }

    get mapFrame() {
        return this._mapFrame
    }

    private async initMap(latLng: LatLng): Promise<any> {
        // once map is html/ready initialize
        await this.mapReady

        let mapElement = this.mapFrame.nativeElement as HTMLBaseElement
        mapElement = mapElement.querySelector('#map')
        const mapOpts: MapOptions = {
            center: latLng,
            zoom: 4,
            preferCanvas: true,
            trackResize: true,
        }
        this.map = map(mapElement, mapOpts)
        this.map.zoomControl.setPosition('topright')

        const tiles = tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png', {
            maxZoom: 18,
            minZoom: 2,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        })

        tiles.addTo(this.map)
    }

    setMarkerOptions(metadata: ExcelModel) {
        return {
            draggable: true,
            title: metadata.name,
            data: metadata, // << custom field
            opacity: 0.8,
            icon: this.markerIcon,
            autoPanSpeed: 10,
        } as any
    }

    /**
     * initialize marker
     */
    initMarker(metadata: ExcelModel): Marker {
        const mrkr: Marker = marker(latLong(metadata), this.setMarkerOptions(metadata))
        mrkr.addTo(this.map).bindPopup(makeMarkerPopUp(metadata))
        this.markerTriggerEvents(mrkr)
        return mrkr
    }

    /** add constitiotion marker to current map selection */
    private addMarker(metadata: ExcelModel): boolean {
        if (metadata?.id === undefined) {
            onerror('[addMarker]', '{metadata.id} not provided')
            return false
        }

        // do not add any repeats
        if (this.markerHistory.filter((n) => n.id === metadata.id).length) return false

        // when adding new item to the map hide selectedMapItem
        if (this.selectedMapItem) this.selectedMapItem = undefined

        log('addMarker for:', metadata.id)

        const mrkr: Marker = this.initMarker(metadata)
        mrkr.addTo(this.map).bindPopup(makeMarkerPopUp(metadata))
        this.markerTriggerEvents(mrkr)
        this.markerHistory.push({ m: mrkr, id: metadata.id })
        return true
    }

    get markerIcon(): IconOptions {
        return icon({
            iconSize: [24, 24],
            iconAnchor: [10, 41], // position location
            popupAnchor: [2, -40],
            iconUrl,
            //  shadowUrl: 'https://unpkg.com/leaflet@1.5.1/dist/images/marker-shadow.png',
        }) as any
    }

    /** provide events to each marker on map */
    markerTriggerEvents(mrkr: Marker): void {
        // add click trigget over the marker and next event
        mrkr.on('popupopen', (e) => {
            const opts: TargetOptions = e.target?.options

            // update icon on selected
            const iconEl: HTMLImageElement = e.sourceTarget._icon
            if (iconEl) iconEl.src = iconUrlSelected
            if (opts) this.subSelect$.next({ ...opts, status: 'OPEN', marker: mrkr })
        })

        mrkr.on('popupclose', (e) => {
            const opts: TargetOptions = e.target?.options

            // restore icon
            const iconEl: HTMLImageElement = e.sourceTarget._icon
            if (iconEl) iconEl.src = iconUrl
            if (opts) this.subSelect$.next({ ...opts, status: 'CLOSE', marker: mrkr })
        })
    }

    /** Remove any existing ConstMarkers*/
    private removeMarkerById(id?: any, all = false): void {
        let index = 0

        this.markerHistory.forEach((el, inx) => {
            try {
                if (all) {
                    this.map.removeLayer(el.m)
                    this.markerHistory.splice(inx, 1)
                    index++
                    return
                }

                if (el.id === id) {
                    this.map.removeLayer(el.m)
                    this.markerHistory.splice(inx, 1)
                    index++
                }
            } catch (err) {
                onerror('[removeMarkers]', err)
            }
        })

        log('total removed', index)
    }

    /**
     * Remove old items
     */
    recycle(latestItems: ExcelModel[]): void {
        if (!latestItems?.length) {
            // remove all if non received
            this.removeMarkerById(undefined, true)
        } else {
            const oldIds = this.markerHistory.filter((x) => !latestItems.filter((y) => y.id === x.id).length).map((n) => n.id)
            oldIds.forEach((id) => {
                this.removeMarkerById(id)
            })
        }
    }

    ngAfterViewInit(): void {
        this.initMap(EUROPE_LAT_LNG).then(() => {
            this.map.enablePopup = true

            // provide results when added or removed items
            // data received from search component
            const s0 = this.states.selectedSearchResults$.pipe(rxDelay(500)).subscribe(async (n) => {
                if (n === undefined) n = []
                this.recycle(n)

                n.forEach(async (metadata) => {
                    if (this.addMarker(metadata)) {
                        this.map.flyTo(latLong(metadata), 9)
                    }
                })
            })
            this.subscriptions.push(...[s0])
        })
    }
    ngOnInit(): void {}
    ngOnDestroy(): void {
        unsubscribe(this.subscriptions, 'LeafletComponent')
    }
}
