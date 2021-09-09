import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core'
import { FormGroup } from '@angular/forms'
import { ExcelCreateHttpService, ExcelProductsHttpService } from '@excel/http'
import { CreateStationFormValues, ExcelProduct, FormStatus, UserPermType } from '@excel/interfaces'
import { AuthPermissionsService } from '@excel/services'
import { ExcelStates } from '@excel/states'
import { toExcelCreate } from '@excel/utils'
import { log, onerror, unsubscribe, warn } from 'x-utils-es'
import { StationForm } from './station-form-create'

/**
 * @description component is used with Locations component, to create new station
 */
@Component({
    selector: 'lib-station-map-create',
    templateUrl: './station-map-create.component.html',
    styleUrls: ['./station-map-create.component.scss'],
})
export class StationMapCreateComponent implements OnInit, OnChanges, OnDestroy {
    errorMessage = ''
    stationFormStatus: FormStatus = 'INITIAL'
    stationForm: StationForm
    subscriptions = []
    permissions: UserPermType = 'BASIC'

    constructor(
        private excelProductsHttpService: ExcelProductsHttpService,
        private states: ExcelStates,
        private authService: AuthPermissionsService,
        private excelCreateHttpService: ExcelCreateHttpService
    ) {
        const excelProductsAsync = this.excelProductsHttpService
            .products()
            .toPromise()
            .then((n) => n.response)
        this.initSubs()
        this.initForm(excelProductsAsync)
    }

    /** new id as timestamp */
    @Input() addNewID?: Date

    /** issue self destroy component  */
    @Output() destroy = new EventEmitter<Date>(true)

    async initForm(excelProductsAsync: Promise<ExcelProduct[]>) {
        let excelProducts
        try {
            excelProducts = await excelProductsAsync
        } catch (err) {
            onerror(err)
            excelProducts = []
        }

        this.stationForm = new StationForm(excelProducts)

        if (this.permissions !== 'ADMINISTRATOR') {
            this.stationForm.fromGroup.disable({ onlySelf: true })
        }
    }

    initSubs(): void {
        const s0 = this.excelCreateHttpService
            .create$((err) => {
                this.stationFormStatus = 'ERROR'
                if (err.error?.message) this.errorMessage = err.error?.message
                else this.errorMessage = 'Form invalid'
                this.stationForm.fromGroup.enable({ onlySelf: true })
                this.stationForm.reset()
            })
            .subscribe((n) => {
                const data = {
                    station: n,
                    add_station_id: n.id,
                }

                this.states.setUpdatedStation(data)
                this.stationForm.reset()
                this.stationFormStatus = 'INITIAL'
                this.destroy.emit(this.addNewID)
                log('excelCreateHttpService', n)
            })

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

        this.subscriptions.push(...[s0, s2])
    }

    public submitForm(f: FormGroup) {
        this.stationFormStatus = 'INITIAL'
        this.errorMessage = undefined
        const formValues: CreateStationFormValues = f.value
        // ExcelUpdate
        if (f.status === 'VALID') {
            const addNew = toExcelCreate(formValues)
            if (addNew) {
                this.excelCreateHttpService.sub$.next(addNew)
                this.stationFormStatus = 'SUBMITTED'
                this.stationForm.fromGroup.disable({ onlySelf: true })
            } else {
                // make form invalid
                this.stationForm.fromGroup.patchValue({ formValid: 0 })
                this.stationFormStatus = 'ERROR'
                this.errorMessage = 'Form invalid'
            }
        } else {
            onerror('submitForm/invalid', f)
            this.stationFormStatus = 'ERROR'
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes?.addNewID?.currentValue) {
            log('create new station, time: ', new Date(this.addNewID))
        }
    }

    ngOnInit(): void {}

    ngOnDestroy(): void {
        unsubscribe([].concat(this.subscriptions, this.stationForm.subscriptions), 'MapItemComponent')
    }
}
