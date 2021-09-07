/**
 * @description this component is used with Leaflet plugin, and it is imported to {PLLeafletModule}
 * - each item is a station map item
 */

import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core'
import { FormGroup } from '@angular/forms'
import { ExcelDeleteHttpService, ExcelUpdateHttpService } from '@excel/http'
import { ExcelModel, ExcelPrice, ExcelProduct, ExcelUpdate, SelectedMapItem, StationFormValues, UserPermType } from '@excel/interfaces'
import { AuthPermissionsService } from '@excel/services'
import { ExcelStates } from '@excel/states'
import { makeMarkerPopUp, toExcelUpdate } from '@excel/utils'
import { Marker } from 'leaflet'
import { copy, log,  onerror,  unsubscribe, warn } from 'x-utils-es'
import {StationForm} from './station-form'

interface ProductWithPrice extends ExcelProduct {
    priceItem?: ExcelPrice
}

@Component({
    selector: 'lib-station-map-item',
    templateUrl: './station-map-item.component.html',
    styleUrls: ['./station-map-item.component.scss'],
})
export class StationMapItemComponent implements OnInit, OnChanges, OnDestroy {
    stationForm: StationForm
    subscriptions = []
    productsWithPrice: ProductWithPrice[]
    item: ExcelModel
    itemCopy: ExcelModel

    /**
     * Give power to this component and allow interaction with current marker it belongs to!
     */
    activeMarker: Marker
    permissions: UserPermType = 'BASIC'

    constructor(private states: ExcelStates, private authService: AuthPermissionsService,
                private excelDeleteHttpService: ExcelDeleteHttpService,
                private excelUpdateHttpService: ExcelUpdateHttpService) {
        this.initSubs()
    }

    @Input() selectedMapItem: SelectedMapItem

    initSubs(): void {
        // http update request
        // we emit change to location component to update {excelStationsSnapShot}
        const s0 = this.excelUpdateHttpService.update$.subscribe((n) => {

            if (n) {

                this.initializeChanges(n)
                this.updateLeafletMarker(n)
                this.states.setUpdatedStation(n, this.activeMarker)
                log('station updated', n)
            }
        })

        // http delete request
        const s1 = this.excelDeleteHttpService.delete$.subscribe(n => {

            this.states.setUpdatedStation({delete_id: this.item.id} as any, this.activeMarker)
            // remove marker
            this.activeMarker.closePopup()
            this.activeMarker.unbindPopup()
            log('station deleted', n)
        })

        // set user permissions
        const s2 = this.authService.user$.subscribe((n) => {
            if (n?.type) {
                this.permissions = n.type
            } else {
                this.permissions = 'BASIC'
                warn('setting basic permission due unhandled setting')
            }
        })

        this.subscriptions.push(...[s0, s1, s2])
    }

    updateLeafletMarker(n: ExcelModel): void {
        this.activeMarker.options.title = n.name
        ; (this.activeMarker.options as any).data = n
        this.activeMarker.bindPopup(makeMarkerPopUp(n))
        this.activeMarker = Object.assign(this.activeMarker)
    }

    validPrice(price: number) {
        return !isNaN(Number((price || '').toString()))
    }

    setProductsWithPrice(item: ExcelModel): ProductWithPrice[] {
        const matchedWithPrice = (prod_id: string): ExcelPrice => item.prices.filter((n) => n.product_id === prod_id)[0]

        return item.products.reduce((n, prod, i) => {
            const priceItem = matchedWithPrice(prod.product_id)
            if (priceItem) n.push({ ...prod, priceItem })
            return n
        }, []) as any
    }

    /** permanently delete station */
    public deleteStation(){
        this.excelDeleteHttpService.sub$.next(this.item.id)
    }

    /** aka on update */
    public submitForm(f: FormGroup) {
        const formValues: StationFormValues = f.value
        // ExcelUpdate
        if (f.status === 'VALID') {
            const update = { id: this.item.id, data: toExcelUpdate(formValues) }
            log('update with', update)
            this.excelUpdateHttpService.sub$.next(update)
            this.stationForm.reset()
            log('errors', this.stationForm.fromGroup.errors)
            log('is valid', this.stationForm.fromGroup.get('formPrices').valid)
        } else {
            onerror('form invalid', f)
        }
    }


    initializeChanges(item: ExcelModel): void{
        this.item = item
        // initialize our form
        this.stationForm = new StationForm(this.item)
        this.productsWithPrice = this.setProductsWithPrice(this.item)
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes?.selectedMapItem?.currentValue) {
            this.activeMarker = this.selectedMapItem.marker
            const selectedMapItemStation = copy(this.selectedMapItem.station)
            this.initializeChanges(selectedMapItemStation)
        }
    }



    ngOnInit(): void {
        // disable permissions
        if (this.permissions !== 'ADMINISTRATOR') {
           if (this.stationForm) this.stationForm.fromGroup.disable({ onlySelf: true })
        }
    }

    ngOnDestroy(): void {
        unsubscribe(this.subscriptions, 'MapItemComponent')
    }
}
