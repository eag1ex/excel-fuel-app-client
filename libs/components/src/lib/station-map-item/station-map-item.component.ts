/**
 * @description this component is used with Leaflet plugin, and it is imported to {PLLeafletModule}
 * - each item is a station map item
 */

import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core'
import { FormGroup } from '@angular/forms'
import { ExcelUpdateHttpService } from '@excel/http'
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

    constructor(private states: ExcelStates, private authService: AuthPermissionsService, private excelUpdateHttpService: ExcelUpdateHttpService) {
        this.initSubs()
    }

    @Input() selectedMapItem: SelectedMapItem

    initSubs(): void {
        // http update events
        // we emit change to location component to update {excelStationsSnapShot}
        const s0 = this.excelUpdateHttpService.update$.subscribe((n) => {

            if (n) {
                // update selected marker
                this.initializeChanges(n)
                this.updateLeafletMarker(n)
                this.states.setUpdatedStation(n, this.activeMarker)
            }
        })

        // set user permissions
        const s1 = this.authService.user$.subscribe((n) => {
            if (n?.type) {
                this.permissions = n.type
            } else {
                this.permissions = 'BASIC'
                warn('setting basic permission due unhandled setting')
            }
        })

        this.subscriptions.push(...[s0, s1])
    }

    updateLeafletMarker(n: ExcelModel): void {
        this.activeMarker.options.title = n.name
        ;(this.activeMarker.options as any).data = n
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

    /** aka on update */
    public submitForm(f: FormGroup) {
        let formValues: StationFormValues = f.value
        // ExcelUpdate
        if (f.status === 'VALID') {
            this.excelUpdateHttpService.sub$.next({ id: this.item.id, data: toExcelUpdate(formValues) })
            this.stationForm.reset()
            log('errors', this.stationForm.fromGroup.errors)
            log('is valid', this.stationForm.fromGroup.get('formPrices').valid)
        } else {
            onerror('form invalid',f)
        }
    }

    trackByID(index: number, item: any) {
        return index
    }

    initializeChanges(item:ExcelModel):void{
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
            this.stationForm.fromGroup.disable({ onlySelf: true })
        }

        // NOTE optional!
        // this will bind immidate power to each chip in search list
        // if (this.activeMarker){
        //     this.states.setUpdatedStation(this.item, this.activeMarker)
        // }
    }

    ngOnDestroy(): void {
        unsubscribe(this.subscriptions, 'MapItemComponent')
    }
}
