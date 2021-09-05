/**
 * @description this component is used with Leaflet plugin, and it is imported to {PLLeafletModule}
 * - each item is a station map item
 */

import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core'
import { FormControl, FormGroup } from '@angular/forms'
import { ExcelUpdateHttpService } from '@excel/http'
import { ExcelModel, ExcelPrice, ExcelProduct, ExcelUpdate, UserPermType } from '@excel/interfaces'
import { AuthPermissionsService } from '@excel/services'
import { ExcelStates } from '@excel/states'

import { filter, debounceTime } from 'rxjs/operators';
import { copy, log,  unsubscribe, warn } from 'x-utils-es'

interface ProductWithPrice extends ExcelProduct {
    priceItem?: ExcelPrice
}


/** each station has price presets assigned to products */

type EditableField = 'name' | 'price'

interface StationMapItem {
    nameCtr: string
    priceCtr: number
    updateCtr: any
    editCtr: number
}

@Component({
    selector: 'lib-map-item',
    templateUrl: './map-item.component.html',
    styleUrls: ['./map-item.component.scss'],
})
export class MapItemComponent implements OnInit, OnChanges, OnDestroy {
    subscriptions = []
    item: ExcelModel

    permissions: UserPermType = 'BASIC'

    /** aka station map item */
    mapItemGroup = new FormGroup({
        nameCtr: new FormControl(''),
        /** hidden input that stores ExcelPrice*/
        productCtr: new FormControl(),
        priceCtr: new FormControl(0),
        /** can update once edit ctr is enabled */
        updateCtr: new FormControl(0),
        /** makes name/price ctrs editable  */
        editCtr: new FormControl(0),
    })

    constructor(
        private states: ExcelStates,
        private authService: AuthPermissionsService, private excelUpdateHttpService: ExcelUpdateHttpService) {
        this.initSubs()

        // disable permissions on load
        this.mapItemGroup.get('nameCtr').disable({ onlySelf: true })
        this.mapItemGroup.get('priceCtr').disable({ onlySelf: true })
        this.mapItemGroup.get('updateCtr').disable({ onlySelf: true })
        this.mapItemGroup.get('editCtr').disable({ onlySelf: true })
        this.mapItemGroup.get('productCtr').disable({ onlySelf: true })
    }

    @Input() selectedMapItem: ExcelModel

    initSubs(): void {

       // http update events
       // we emit change to location component to update {excelStationsSnapShot}
       const s0 = this.excelUpdateHttpService.update$.subscribe(n => {
            log('[excelUpdateHttpService]', n)
            this.resetForm()
            if (n){
                this.states.setUpdatedStation(n)
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

       const s2 = this.mapItemGroup
            .get('editCtr')
            .valueChanges.pipe(filter((n) => this.canEdit))
            .subscribe((n: number) => {
                if (n) {
                    this.mapItemGroup.get('updateCtr').enable({ onlySelf: true })
                    this.mapItemGroup.get('nameCtr').enable({ onlySelf: true })
                    this.mapItemGroup.get('priceCtr').enable({ onlySelf: true })
                    this.mapItemGroup.get('productCtr').enable({ onlySelf: true })
                }
            })

        // on update is like submit
       const s3 = this.mapItemGroup
            .get('updateCtr')
            .valueChanges.pipe(filter((n) => this.canUpdate), debounceTime(700))
            .subscribe((n: number) => {
                if (n) {
                    this.excelUpdateHttpService.sub$.next({id: this.item.id, data: this.formValues})
                }
            })

       this.subscriptions.push(...[s0, s1, s2, s3])
    }

    get formValues(): ExcelUpdate {
        const excelPrice: ExcelPrice = this.mapItemGroup.get('productCtr').value
        return {
            name: this.mapItemGroup.get('nameCtr').value,
            price: Number(excelPrice.price),
            product_id: excelPrice.product_id,
        }
    }

    /**
     *  on data send reset form values
     */
    resetForm(): void {

           this.mapItemGroup.markAsPristine()
           this.mapItemGroup.markAsUntouched()
           this.mapItemGroup.get('updateCtr').patchValue(0, { onlySelf: true })
           this.mapItemGroup.get('nameCtr').disable({ onlySelf: true })
           this.mapItemGroup.get('priceCtr').disable({ onlySelf: true })
           this.mapItemGroup.get('productCtr').disable({ onlySelf: true })
    }

    /** we are an admit, ctr is enabled and value is th>0 */
    canEditField(fieldName: EditableField): boolean {
        if (fieldName === 'name') {
            return this.permissions === 'ADMINISTRATOR' && this.mapItemGroup.get('nameCtr').enabled
        }

        if (fieldName === 'price') {
            return this.permissions === 'ADMINISTRATOR' && this.mapItemGroup.get('priceCtr').enabled
        } else return false
    }

    /** check if current ctr was updated */
    fieldUpdated(fieldName: EditableField): boolean {
        if (fieldName === 'name') {
            return this.canEdit && this.mapItemGroup.get('nameCtr').touched
        }
        if (fieldName === 'price') {
            return this.canEdit && this.mapItemGroup.get('priceCtr').touched
        } else return false
    }

    validPrice(price: number) {
        return !isNaN(Number((price || '').toString()))
    }

    get canEdit(): boolean {
        return this.mapItemGroup.get('editCtr').enabled && this.permissions === 'ADMINISTRATOR'
    }

    get canUpdate(): boolean {
        return this.canEdit && this.mapItemGroup.get('updateCtr').enabled && this.mapItemGroup.touched
    }

    get productsWithPrice(): ProductWithPrice[] {
        const matchedWithPrice = (prod_id: string): ExcelPrice => this.item.prices.filter((n) => n.product_id === prod_id)[0]

        return this.item.products.reduce((n, prod, i) => {
            const priceItem = matchedWithPrice(prod.product_id)
            if (priceItem) n.push({ ...prod, priceItem })
            return n
        }, []) as any
    }

    public onEdit() {
        this.mapItemGroup.get('editCtr').patchValue(1)
    }

    public onUpdate() {
        this.mapItemGroup.get('updateCtr').patchValue(1)
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes?.selectedMapItem?.currentValue) {
            this.item = copy(this.selectedMapItem)

            // this.mapItemGroup.get('nameCtr').enable({onlySelf: true})
            this.mapItemGroup.get('nameCtr').setValue(this.item.name)
        }
    }

    ngOnInit(): void {
        // enable permissions
        if (this.permissions === 'ADMINISTRATOR') {
            this.mapItemGroup.get('editCtr').enable({ onlySelf: true })
        }
    }

    ngOnDestroy(): void {
        unsubscribe(this.subscriptions, 'MapItemComponent')
    }
}
