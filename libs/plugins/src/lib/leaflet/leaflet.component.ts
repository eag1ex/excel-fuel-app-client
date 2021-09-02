import { Output, EventEmitter, ElementRef, ViewChild, OnDestroy } from '@angular/core'
import { Component, OnInit, AfterViewInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { EUROPE_LAT_LNG } from '@pl/data'
import { PetrolModel, LatLng } from '@pl/interfaces'
import { latLong } from '@pl/utils'
import { map, tileLayer, icon, marker, Marker, Map, geoJSON, GeoJSON, LatLngExpression } from 'leaflet'
import { filter, tap } from 'rxjs/operators'
import { log, delay, sq, warn, onerror, isEmpty, copy } from 'x-utils-es'
import { dymmyItem } from './dummy.data'
// import { RXEvents } from './leaflet-rx-events'



const iconRetinaUrl = '/libs/theme/assets/marker-icon-2x.png'
const iconUrl = 'libs/theme/assets/icons/baseline_article_black_24dp.png'
const shadowUrl = '/libs/theme/assets/marker-shadow.png'
const iconDefault = icon({
    iconRetinaUrl,
    iconUrl,
    shadowUrl,
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
    private _mapFrame: ElementRef
    mapReady = sq()
    // private rxEvents = new RXEvents()
    private map: Map & { enablePopup?: boolean }
    markerHistory: Array<{ m: Marker; id: string }> = []
    constructor(private route: ActivatedRoute) {}

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
    private addMarker(latLng: LatLng, metadata: PetrolModel, delayTime = 200): void {
        if (!metadata?.id) {
            onerror('[addMarker]', '{metadata.id} not provided')
            return
        }

        this.removeMarkers() // remove pre/existing markers first
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
        mrkr.on('click', (e) => {
            log('on marker click', e)
        })
        //  .openPopup()
        this.markerHistory.push({ m: mrkr, id: metadata.id })
    }

    /** Remove any existing ConstMarkers*/
    private removeMarkers(): void {
        this.markerHistory.forEach((el) => {
            try {
                this.map.removeLayer(el.m)
                log('removeMarkers:', el.id)
            } catch (err) {
                onerror('[removeMarkers]', err)
            }
        })
    }

    ngAfterViewInit(): void {
        this.initMap(EUROPE_LAT_LNG).then(() => {
            this.map.enablePopup = true

            delay(2000).then(() => {
                this.map.flyTo(latLong(dymmyItem), 5)
                this.addMarker(latLong(dymmyItem), dymmyItem)
            })
        })
    }
    ngOnInit(): void {}
    ngOnDestroy(): void {
        //  this.rxEvents.unsub()
        //  this.leafletEventService.unsub()
        //  unsubscribe(this.subscriptions, 'LeafletComponent')
    }
}
