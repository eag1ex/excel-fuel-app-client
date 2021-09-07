import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms'
import { ExcelProduct } from '@excel/interfaces'

import { debounceTime } from 'rxjs/operators'
import {  copy, log } from 'x-utils-es'


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
    formProductsSelected = null
    constructor(excelProducts: ExcelProduct[]) {
        this.excelProducts = excelProducts

        this.initForm()
       // this.patchValues()

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
            formSetPrices: new FormArray(this.excelProducts.map(n => new FormControl(0, priceValidators))),
            formProducts: new FormControl([]),
            formProductsUpdated: new FormArray(this.excelProducts.map(n => new FormControl(''))),

        })
    }

    reset(): void {
        this.fromGroup.markAsPristine()
        this.fromGroup.markAsUntouched()
    }

    onFormProductsSelected(selected: ExcelProduct[]): void{
        let formProductsUpdated: ExcelProduct[] = copy(this.formProductsUpdated.value)

        if (selected?.length !== formProductsUpdated.length){

            if (selected.length){
                const notFound = (updated: ExcelProduct) => selected.filter(n => n.product_id !== updated.product_id).length

                formProductsUpdated.forEach((updated, inx) => {
                    if (notFound(updated)) formProductsUpdated.splice(inx, 1)
                })

            } else formProductsUpdated = []


            this.fromGroup.patchValue({formProductsUpdated})
        }

    }

    onFormProductsUpdated(selected: ExcelProduct, indexOrder: number): void{

        // grab correct index
        let formProductsUpdated: ExcelProduct[] = this.formProductsUpdated.value
        if (formProductsUpdated?.length)   formProductsUpdated[indexOrder] = selected
        else formProductsUpdated = [selected]
        this.fromGroup.patchValue({formProductsUpdated})
    }

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

    get productOptions(): ExcelProduct[] {
        return (this.fromGroup.get('formProducts').value || []) as ExcelProduct[]
    }


    get formProductsUpdated(): FormArray {
        return this.fromGroup.get('formProductsUpdated') as FormArray
    }


}
