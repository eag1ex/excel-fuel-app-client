import { AfterViewInit, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core'
import { FormGroup } from '@angular/forms'
import { ExcelDeleteHttpService, ExcelUpdateHttpService } from '@excel/http'
import { ExcelModel, ExcelPrice, ExcelProduct, FormStatus, SelectedMapItem, StationFormValues, UserPermType } from '@excel/interfaces'
import { AuthPermissionsService } from '@excel/services'
import { ExcelStates } from '@excel/states'
import { makeMarkerPopUp, toExcelUpdate } from '@excel/utils'
import { Marker } from 'leaflet'
import { copy, log, onerror, unsubscribe, warn, delay } from 'x-utils-es'
import { StationForm } from './station-form-update'

interface ProductWithPrice extends ExcelProduct {
    priceItem?: ExcelPrice
}

/**
 * @description component is used with Leaflet plugin, and it is imported to {PLLeafletModule}
 * - each item is a station map item
 */
@Component({
    selector: 'lib-station-map-update',
    templateUrl: './station-map-update.component.html',
    styleUrls: ['./station-map-update.component.scss'],
})
export class StationMapUpdateComponent implements OnInit, OnChanges, OnDestroy,AfterViewInit {
    stationForm: StationForm
    subscriptions = []
    productsWithPrice: ProductWithPrice[]
    item: ExcelModel
    errorMessage = ''
    softMessage = ''
    stationFormStatus: FormStatus = 'INITIAL'

    /**
     * Give power to this component and allow interaction with current marker it belongs to!
     */
    activeMarker: Marker
    permissions: UserPermType = 'BASIC'

    constructor(
        private states: ExcelStates,
        private authService: AuthPermissionsService,
        private excelDeleteHttpService: ExcelDeleteHttpService,
        private excelUpdateHttpService: ExcelUpdateHttpService
    ) {
        this.initSubs()
    }

    @Input() selectedMapItem: SelectedMapItem

    initSubs(): void {
        // http update request
        // we emit change to location component to update {excelStationsSnapShot}
        const s0 = this.excelUpdateHttpService
            .update$((err) => {
                this.softMessage = ''
                this.stationFormStatus = 'ERROR'
                if (err.error?.message) this.errorMessage = err.error?.message
                else this.errorMessage = 'Form invalid'
                this.stationForm.fromGroup.enable({ onlySelf: true })
                this.stationForm.reset()
            })
            .subscribe((n) => {
                if (n) {
                    this.initializeChanges(n)
                    this.updateLeafletMarker(n)

                    const data = {
                        station: n,
                        marker: this.activeMarker,
                    }

                    this.stationForm.reset()
                    this.stationFormStatus = 'INITIAL'
                   
                    this.states.setUpdatedStation(data)
                    this.softMessage = `Station for <strong>${n.name}</strong> updated`
                }
            })

        // http delete request
        const s1 = this.excelDeleteHttpService
            .delete$((err) => {
                this.softMessage = ''
                this.stationFormStatus = 'ERROR'
                if (err.error?.message) this.errorMessage = err.error?.message
                else this.errorMessage = 'Station doesnt exist'
                this.stationForm.fromGroup.enable({ onlySelf: true })
                this.stationForm.reset()
            })
            .subscribe((n) => {
                const data = {
                    delete_id: this.item.id,
                    marker: this.activeMarker,
                } as any
                this.states.setUpdatedStation(data)

                // remove marker
                this.activeMarker.closePopup()
                this.activeMarker.unbindPopup()
                this.stationFormStatus = 'INITIAL'
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
        this.activeMarker.options.title = n.name;
        (this.activeMarker.options as any).data = n
        this.activeMarker.bindPopup(makeMarkerPopUp(n))
        this.activeMarker = Object.assign(this.activeMarker)
    }

    validPrice(price: number) {
        return !isNaN(Number((price || '').toString()))
    }

    setProductsWithPrice(item: ExcelModel): ProductWithPrice[] {
        if (!item?.products?.length) return []
        const matchedWithPrice = (prod_id: string): ExcelPrice => item.prices.filter((n) => n.product_id === prod_id)[0]

        return item.products.reduce((n, prod, i) => {
            const priceItem = matchedWithPrice(prod.product_id)
            if (priceItem) n.push({ ...prod, priceItem })
            return n
        }, []) as any
    }

    /** permanently delete station */
    public deleteStation() {
        delay(500).then(() => {
            this.excelDeleteHttpService.sub$.next(this.item.id)
        })

        this.stationFormStatus = 'SUBMITTED'
        this.errorMessage = undefined
    }


    public closeStation() {
        this.activeMarker.closePopup()
    }

    /** aka on update */
    public submitForm(f: FormGroup) {
        this.softMessage = ''
        this.stationFormStatus = 'INITIAL'
        this.errorMessage = undefined
        const formValues: StationFormValues = f.value

        if (f.status === 'VALID') {
            const toUpdate = toExcelUpdate(formValues)
            this.excelUpdateHttpService.sub$.next({ id: this.item.id, data: toUpdate })
            this.stationFormStatus = 'SUBMITTED'
            this.stationForm.fromGroup.disable({ onlySelf: true })
        } else {
            this.stationFormStatus = 'ERROR'
            this.errorMessage = 'Form invalid'
            onerror('submitForm/invalid', f)
        }
    }

    initializeChanges(item: ExcelModel): void {
        this.item = item
        // initialize our form
        this.stationForm = new StationForm(this.item, this.permissions)
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

    ngAfterViewInit() {
        this.states.setUpdatedStation({close_create_stataion:true,index:1} as any)
    }

    ngOnDestroy(): void {
        unsubscribe(this.subscriptions, 'MapItemComponent')
    }
}
