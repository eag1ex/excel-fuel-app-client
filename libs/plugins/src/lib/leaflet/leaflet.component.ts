import { Output, EventEmitter, ElementRef, ViewChild, OnDestroy } from '@angular/core'
import { Component, OnInit, AfterViewInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { EUROPE_LAT_LNG } from '@pl/data'
import { PetrolModel, LatLng } from '@pl/interfaces'
import { latLong } from '@pl/utils'
import { map, tileLayer, icon, marker, Marker, Map, geoJSON, GeoJSON, LatLngExpression, Icon } from 'leaflet'
import { log, delay, sq, warn, onerror, isEmpty, copy, isFalsy, unsubscribe } from 'x-utils-es';
import { dymmyItem } from './dummy.data'
import { Subject } from 'rxjs';
import { filter, debounceTime } from 'rxjs/operators';
import { PLstates } from '@pl/states'

interface TargetOptions{
        draggable?: boolean;
        title?: string,
        data: PetrolModel,
        opacity?: number,
        icon?: Icon
}



const iconUrl = 'libs/theme/assets/icons/local_gas_station_yellow_24dp.svg'
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
    subSelect$: Subject<TargetOptions & { status: 'OPEN' | 'CLOSE' }> = new Subject()

    private _mapFrame: ElementRef
    mapReady = sq()
    selectedMapItem: PetrolModel
    private map: Map & { enablePopup?: boolean }
    markerHistory: Array<{ m: Marker; id: string }> = []
    constructor(private states: PLstates, private route: ActivatedRoute) {
        const s0 = this.subSelect$
            .pipe(
                debounceTime(500),
                filter((n) => !isFalsy(n))
            )
            .subscribe((n) => {
                if (n.status === 'CLOSE') {
                    this.selectedMapItem = undefined
                } else {
                    this.selectedMapItem = n.data
                    log('selected', this.selectedMapItem)
                }
            })

        this.subscriptions.push(s0)
    }

    // @Output() mapUpdated = new EventEmitter<ILeafletMapUpdated>()
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
        log('init map', latLng)
        this.map = map(mapElement, {
            center: latLng,
            zoom: 4,
            preferCanvas: true,
            trackResize: true,
        })

        const tiles = tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png', {
            maxZoom: 18,
            minZoom: 2,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        })

        tiles.addTo(this.map)
    }

    /** add constitiotion marker to current map selection */
    private addMarker(latLng: LatLng, metadata: PetrolModel): boolean {
        if (metadata?.id === undefined) {
            onerror('[addMarker]', '{metadata.id} not provided')
            return false
        }

        // do not add any repeats
        if (this.markerHistory.filter((n) => n.id === metadata.id).length) return false

        // when adding new item to the map hide selectedMapItem
        if (this.selectedMapItem) this.selectedMapItem = undefined

        // this.removeMarkers() // remove pre/existing markers first
        log('addMarker for:', metadata.id)

        const markerIcon = icon({
            iconSize: [24, 24],
            iconAnchor: [10, 41], // position location
            popupAnchor: [2, -40],
            iconUrl,
            //  shadowUrl: 'https://unpkg.com/leaflet@1.5.1/dist/images/marker-shadow.png',
        })

        const options = {
            draggable: true,
            title: metadata.name,
            data: metadata,
            opacity: 0.8,
            icon: markerIcon,
        }

        const popupHTML = () => {
            const list = (el) => `<li class="list-group-item list-group-item-light">${el}</li>`

            const items: Array<string> = [
                metadata.name ? { value: 'Name: ' + metadata.name } : null,
                metadata.city ? { value: 'City: ' + metadata.city } : null,
                metadata.address ? { value: 'Address: ' + metadata.address } : null,
            ]
                .filter((n) => !!n)
                .map((n) => n.value)
                .map((n) => list(n))

            let htmlList = ''

            for (let inx = 0; inx < items.length; inx++) htmlList += items[inx]
            return `
                <ul class="list-group px-2">
                    ${htmlList}
                </ul> `
        }

        const mrkr: Marker = marker(latLng, options)

        mrkr.addTo(this.map).bindPopup(popupHTML())

        // add click trigget over the marker and next event
        mrkr.on('popupopen', (e) => {
            const opts: TargetOptions = e.target?.options
            if (opts) this.subSelect$.next({ ...opts, status: 'OPEN' })
        })
        mrkr.on('popupclose', (e) => {
            const opts: TargetOptions = e.target?.options
            if (opts) this.subSelect$.next({ ...opts, status: 'CLOSE' })
        })

        this.markerHistory.push({ m: mrkr, id: metadata.id })
        return true
    }

    /** Remove any existing ConstMarkers*/
    private removeMarkerById(id?: any, all = false): void {
        let index = 0

        this.markerHistory.forEach((el, inx) => {
            try {
                if (all){
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
     * Remove map items not received from selectedSearchResults$ event
     */
    recycle(latestItems: PetrolModel[]): void {
        if (!latestItems?.length) {
            // remove all if non received
            this.removeMarkerById(undefined, true)
        } else {
            const oldIds = this.markerHistory.filter((x) => !latestItems.filter((y) => y.id === x.id).length).map(n => n.id)

            oldIds.forEach(id => {
                this.removeMarkerById(id)
            })

        }
    }

    ngAfterViewInit(): void {
        this.initMap(EUROPE_LAT_LNG).then(() => {
            this.map.enablePopup = true

            // provide results when added or removed items
            const s0 = this.states.selectedSearchResults$.subscribe(async (n) => {
                if (n === undefined) n = []
                this.recycle(n)

                n.forEach(async (x) => {
                    if (this.addMarker(latLong(x), x)) {
                        this.map.flyTo(latLong(x), 9)
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
