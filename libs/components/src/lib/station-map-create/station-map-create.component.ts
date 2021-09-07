/**
 * @description this component is used with Leaflet plugin, and it is imported to {PLLeafletModule}
 * - each item is a station map item
 */

import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core'
import { FormGroup } from '@angular/forms'
import { ExcelDeleteHttpService, ExcelProductsHttpService, ExcelUpdateHttpService } from '@excel/http'
import { CreateStationFormValues, ExcelModel, ExcelPrice, ExcelProduct, UserPermType } from '@excel/interfaces'
import { AuthPermissionsService } from '@excel/services'
import { ExcelStates } from '@excel/states'
import { Marker } from 'leaflet'
import { log,  onerror,  unsubscribe, warn } from 'x-utils-es'
import {StationForm} from './station-form-create'


interface ProductWithPrice extends ExcelProduct {
    priceItem?: ExcelPrice
}

@Component({
    selector: 'lib-station-map-create',
    templateUrl: './station-map-create.component.html',
    styleUrls: ['./station-map-create.component.scss'],
})
export class StationMapCreateComponent implements OnInit, OnChanges, OnDestroy {
    stationForm: StationForm
    subscriptions = []
    productsWithPrice: ProductWithPrice[]
    createdItem: ExcelModel

    /**
     * Give power to this component and allow interaction with current marker it belongs to!
     */
    activeMarker: Marker
    permissions: UserPermType = 'BASIC'

    constructor(
        private excelProductsHttpService: ExcelProductsHttpService,
        private states: ExcelStates, private authService: AuthPermissionsService,
        private excelDeleteHttpService: ExcelDeleteHttpService,
        private excelUpdateHttpService: ExcelUpdateHttpService) {

            const excelProductsAsync = this.excelProductsHttpService.products().toPromise().then(n => n.response)
            this.initSubs()
            this.initForm(excelProductsAsync)

    }

    /** new id as timestamp */
    @Input() addNewID?: Date


    async initForm(excelProductsAsync: Promise<ExcelProduct[]>){

        let excelProducts
        try{
            excelProducts = await excelProductsAsync
        }catch (err){
            onerror(err)
            excelProducts = []
        }

        this.stationForm = new StationForm(excelProducts)

        if (this.permissions !== 'ADMINISTRATOR') {
            this.stationForm.fromGroup.disable({ onlySelf: true })
        }
    }


    initSubs(): void {

        // grab available products to select from


        // http update request
        // we emit change to location component to update {excelStationsSnapShot}

        // const s0 = this.excelUpdateHttpService.update$.subscribe((n) => {

        //     if (n) {

        //         this.initializeChanges(n)
        //         this.updateLeafletMarker(n)
        //         this.states.setUpdatedStation(n, this.activeMarker)
        //         log('station updated', n)
        //     }
        // })

        // http delete request
        // const s1 = this.excelDeleteHttpService.delete$.subscribe(n => {

        //     this.states.setUpdatedStation({delete_id: this.item.id} as any, this.activeMarker)
        //     // remove marker
        //     this.activeMarker.closePopup()
        //     this.activeMarker.unbindPopup()
        //     log('station deleted', n)
        // })

        // set user permissions
        const s2 = this.authService.user$.subscribe((n) => {

            if (n?.type) {

                this.permissions = n.type
                log('this.permissions', this.permissions)
            } else {
                this.permissions = 'BASIC'
                warn('setting basic permission due unhandled setting')
            }
        })

        this.subscriptions.push(...[ s2])
    }


    validPrice(price: number) {
        return !isNaN(Number((price || '').toString()))
    }

    public submitForm(f: FormGroup) {
        const formValues: CreateStationFormValues = f.value
        // ExcelUpdate
        if (f.status === 'VALID') {
            // const update = { id: this.item.id, data: toExcelUpdate(formValues) }
            // log('update with', update)
            // this.excelUpdateHttpService.sub$.next(update)
            this.stationForm.reset()
            log('errors', this.stationForm.fromGroup.errors)
            log('is valid', this.stationForm.fromGroup.get('formPrices').valid)
            log('formValues', f)
        } else {
            onerror('form invalid', f)
        }
    }



    initializeChanges(){
       // this.item = item
        // initialize our form


       // this.productsWithPrice = this.setProductsWithPrice(this.item)
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes?.addNewID?.currentValue) {
            log('create new station, time: ', new Date(this.addNewID))
         //   this.activeMarker = this.selectedMapItem.marker
         //   const selectedMapItemStation = copy(this.selectedMapItem.station)

        }
    }



    ngOnInit(): void {
        // disable permissions


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
