import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms'
import { ExcelModel, ExcelPrice, UserPermType } from '@excel/interfaces'


/** form resembles ExcelModel structure */
export class StationForm {
    fromGroup: FormGroup
    private permissions: UserPermType
    private item: ExcelModel
    constructor(item: ExcelModel, permissions: UserPermType) {
        this.item = item
        this.permissions = permissions

        this.initForm()
        this.patchValues()

        // disabled initially, edit by user
        this.fromGroup.disable({ onlySelf: true })

    }

    initForm() {
        const priceValidators = [Validators.min(0), Validators.required]
        this.fromGroup = new FormGroup({
            formName: new FormControl('', [Validators.required]),
            formPrices: new FormArray([...this.item.prices.map((n) => new FormControl(undefined, priceValidators))]),
            // hidden filed
            formProduct_ids: new FormArray([...this.item.prices.map((n) => new FormControl(undefined, [Validators.required]))]),

        })
    }

    edit(): void {
        if (this.permissions !== 'ADMINISTRATOR') return
        if (this.fromGroup.disabled) this.fromGroup.enable({ onlySelf: true })
        else this.fromGroup.disable({ onlySelf: true })
    }

    reset(): void {
        this.fromGroup.markAsPristine()
        this.fromGroup.markAsUntouched()
    }

    patchValues() {
        this.fromGroup.patchValue({ formName: this.item.name })
        this.fromGroup.patchValue({ formPrices: this.item.prices.map((n) => n.price) })
        // same index
        this.fromGroup.patchValue({ formProduct_ids: this.item.prices.map((n) => n.product_id) })
    }

    priceItem(index: number): ExcelPrice {
        return this.item?.prices[index]
    }

    /** these values are always the same and should be both send on change */
    updateFormProduct_ids(): void {
        const product_ids = this.item?.prices.map((n) => n.product_id)
        this.fromGroup.get('formProduct_ids').patchValue(product_ids)
    }

    get formName(): FormControl {
        return this.fromGroup.get('formName') as FormControl
    }

    get formPrices(): FormArray {
        return this.fromGroup.get('formPrices') as FormArray
    }

    get formProductIds(): FormArray {
        return this.fromGroup.get('formProduct_ids') as FormArray
    }

}
