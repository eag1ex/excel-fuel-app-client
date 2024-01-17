import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms'
import { ExcelProduct } from '@excel/interfaces'
import { debounceTime } from 'rxjs/operators'
import {   log } from 'x-utils-es'

/** form resembles ExcelModel structure */
export class StationForm {
    subscriptions = []
    excelProducts: ExcelProduct[] = []
    fromGroup: FormGroup
    formProductsSelected = null
    constructor(excelProducts: ExcelProduct[]) {
        this.excelProducts = excelProducts
        this.initForm()
        this.patchValues()
        const s0 = this.fromGroup.valueChanges.pipe(debounceTime(300)).subscribe((n) => {
            log('fromGroup/valueChanges', n)
            this.fromGroup.get('formValid').patchValue(1, {onlySelf: true})
        })

        this.subscriptions.push(s0)
    }


    initForm(){

        const priceValidators = [Validators.min(0), Validators.required]
        this.fromGroup = new FormGroup({
            formName: new FormControl('', [Validators.required]),
            formCity: new FormControl('', [Validators.required]),
            formAddress: new FormControl('', [Validators.required]),
            formLatitude: new FormControl('', [Validators.required]),
            formLongitude: new FormControl('', [Validators.required]),
            // select price for available products
            formSetPrices: new FormArray(this.excelProducts.map(n => new FormControl('', priceValidators))),
            formPriceIDS: new FormArray(this.excelProducts.map(n => new FormControl('',  Validators.required))),
            formProducts: new FormControl([]),
            formProductsUpdated: new FormArray(this.excelProducts.map(n => new FormControl(''))),

            /** hidden form, in case it failed toExcelCreate we force in invalidate the form */
            formValid: new FormControl(0, [Validators.min(1), Validators.required]),
        })
    }

    reset(): void {
        this.fromGroup.markAsPristine()
        this.fromGroup.markAsUntouched()
    }

    patchValues(): void{
        // makes sure we pair price with product_id by selected index
        this.fromGroup.patchValue({formPriceIDS: this.excelProducts.map(n => n.product_id)})
    }

    /** make product options selected vyt default  */
    onFormProductsSelected(selected: ExcelProduct[]): void{

        this.fromGroup.patchValue({formProductsUpdated: selected})
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
    get formPriceIDS(): FormArray {
        return this.fromGroup.get('formPriceIDS') as FormArray
    }



}
