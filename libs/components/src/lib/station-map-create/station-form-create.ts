import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms'
import { ExcelModel, ExcelPrice, ExcelProduct } from '@excel/interfaces'
import { debounceTime } from 'rxjs/operators'
import { log } from 'x-utils-es'


// export interface ExcelModel {
//     /** server assigned */
//     id?: string
//     /** user can update */
//     name: string
//     address: string
//     city: string
//     latitude: number
//     longitude: number;
//     /** server assigned */
//     updated_at?: Date | string;
//     /** server assigned */
//     created_at?: Date | string;
//     /** user can update */
//     prices: ExcelPrice[]
//     products: ExcelProduct[]
// }

/** form resembles ExcelModel structure */
export class StationForm {
    excelProducts: ExcelProduct[] = []
    fromGroup: FormGroup
    constructor(excelProducts: ExcelProduct[]) {
        this.excelProducts = excelProducts

        this.initForm()

      //  this.patchValues()
        this.fromGroup.valueChanges.pipe(debounceTime(300)).subscribe((n) => {
            log('fromGroup/changes', n)
        })
    }


    initForm(){
        const priceValidators = [Validators.min(0), Validators.required]
        this.fromGroup = new FormGroup({
            formName: new FormControl('', [Validators.required]),
            formCity: new FormControl('', [Validators.required]),
            formAddress: new FormControl('', [Validators.required]),
            formLatitude: new FormControl(0, [Validators.required]),
            formLongitude: new FormControl(0, [Validators.required]),
            // select price for available products
            formSetPrices: new FormArray([new FormControl(undefined, priceValidators)]),
            // select-list
            formProducts: new FormControl([], [Validators.required]),
            // Choose from available products
         //   formProducts: new FormArray([new FormControl({})])
        })
    }

    reset(): void {
        this.fromGroup.markAsPristine()
        this.fromGroup.markAsUntouched()
    }

    // patchValues() {
    //     this.fromGroup.patchValue({ formName: this.item.name })
    //     this.fromGroup.patchValue({ formPrices: this.item.prices.map((n) => n.price) })
    //     // same index
    //     this.fromGroup.patchValue({ formProduct_ids: this.item.prices.map((n) => n.product_id) })
    // }

    // priceItem(index: number): ExcelPrice {
    //     return this.item?.prices[index]
    // }

    /** these values are always the same and should be both send on change */
    // updateFormProduct_ids(): void {
    //     const product_ids = this.item?.prices.map((n) => n.product_id)
    //     this.fromGroup.get('formProduct_ids').patchValue(product_ids)
    // }

    get formName(): FormControl {
        return this.fromGroup.get('formName') as FormControl
    }

    get formCity(): FormControl{
        return this.fromGroup.get('formCity') as FormControl
    }

    get formSetPrices(): FormArray {
        return this.fromGroup.get('formSetPrices') as FormArray
    }

    get formProducts(): FormControl {
        return this.fromGroup.get('formProducts') as FormControl
    }


}
