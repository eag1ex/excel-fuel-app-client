/**
 * @description this component is used with Leaflet plugin, and it is imported to {PLLeafletModule}
 * - each item is a station map item
 */

import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { PetrolModel, PetrolPrice, PetrolProduct, UserPermType } from '@pl/interfaces';
import { AuthPermissionsService } from '@pl/services';
import { filter } from 'rxjs/operators';
import { log, unsubscribe } from 'x-utils-es';


/*
   "prices": [
      {
        "price": 1.81,
        "currency": "CHF",
        "product_id": "DIESEL"
      }
    ],

    "products": [
      {
        "product_id": "DIESEL",
        "points": [
          {
            "id": "1",
            "status": "available"
          },

          {
            "id": "2",
            "status": "not_available"
          }
        ]
      }
    ]
* */

interface ProductWithPrice extends PetrolProduct{
  priceItem?: PetrolPrice
}


type EditableField = 'name' | 'price'

interface StationMapItem{
  nameCtr: string;
  priceCtr: number;
  updateCtr: any;
  editCtr:number
}

@Component({
    selector: 'lib-map-item',
    templateUrl: './map-item.component.html',
    styleUrls: ['./map-item.component.scss'],
})
export class MapItemComponent implements OnInit, OnChanges,OnDestroy {
    subscriptions = []
    item: PetrolModel
    itemNameValue: string
    itemPriceValuesArray: Array<number> = []
    permissions: UserPermType

    /** aka station map item */
    mapItemGroup = new FormGroup({
        nameCtr: new FormControl(''),
        priceCtr: new FormControl(),
        /** can update once edit ctr is enabled */
        updateCtr: new FormControl(0),
        /** makes name/price ctrs editable  */
        editCtr: new FormControl(0),
    })

    constructor(private authService: AuthPermissionsService) {

        // set default for now
        this.permissions = 'ADMINISTRATOR'

        this.initSubs()    

        // disable permissions on load
        this.mapItemGroup.get('nameCtr').disable({ onlySelf: true })
        this.mapItemGroup.get('priceCtr').disable({ onlySelf: true })
        this.mapItemGroup.get('updateCtr').disable({ onlySelf: true })
        this.mapItemGroup.get('editCtr').disable({ onlySelf: true })
    }

    @Input() selectedMapItem: PetrolModel


    initSubs():void{
     const s0= this.mapItemGroup.get('editCtr').valueChanges
      .pipe(filter((n) => this.canEdit))
      .subscribe((n:Number) => {
       
          if (n) {
              this.mapItemGroup.get('updateCtr').enable({ onlySelf: true })
              this.mapItemGroup.get('nameCtr').enable({ onlySelf: true })
              this.mapItemGroup.get('priceCtr').enable({ onlySelf: true })
              log('nameCtr/enabled!')
          }
       
      })

      // on update is like submit
     const s1 = this.mapItemGroup
          .get('updateCtr')
          .valueChanges.pipe(filter((n) => this.canUpdate))
          .subscribe((n: number) => {
              if (n) {
                  this.mapItemGroup.markAsPristine()
                  this.mapItemGroup.markAsUntouched()
                  this.mapItemGroup.get('updateCtr').patchValue(0, { onlySelf: true })
                  this.mapItemGroup.get('nameCtr').disable({ onlySelf: true })
                  log('form send')
              }
          })

          this.subscriptions.push(...[s0,s1])
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

    get canEdit(): boolean {
        return this.mapItemGroup.get('editCtr').enabled && this.permissions === 'ADMINISTRATOR'
    }

    get canUpdate(): boolean {
        return this.canEdit && this.mapItemGroup.get('updateCtr').enabled && this.mapItemGroup.touched
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes?.selectedMapItem?.currentValue) {
            this.item = this.selectedMapItem
            this.itemPriceValuesArray = this.item.prices.map((n) => n.price)
            // this.mapItemGroup.get('nameCtr').enable({onlySelf: true})
            this.mapItemGroup.get('nameCtr').setValue(this.item.name)
        }
    }

    /** return products that matched with price id pair */
    get productsWithPrice(): ProductWithPrice[] {
        const matchedWithPrice = (prod_id: string): PetrolPrice => this.item.prices.filter((n) => n.product_id === prod_id)[0]

        return this.item.products.reduce((n, prod, i) => {
            const priceItem = matchedWithPrice(prod.product_id)
            if (priceItem) n.push({ ...prod, priceItem })
            return n
        }, [])
    }

    public onEdit() {
        this.mapItemGroup.get('editCtr').patchValue(1)
    }

    public onUpdate() {
        this.mapItemGroup.get('updateCtr').patchValue(1)
    }

    ngOnInit(): void {
        // enable permissions
        if (this.permissions === 'ADMINISTRATOR') {
            this.mapItemGroup.get('editCtr').enable({ onlySelf: true })
        }
    }

    ngOnDestroy():void{
      unsubscribe(this.subscriptions,'MapItemComponent')
    }
}
