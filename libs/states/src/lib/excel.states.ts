
/**
 * NOTE This is my own RX store implementation, and use on other angular projects
 * - Implements RxStore logic, used to store data instead of new http request.
 */

import { Injectable, isDevMode } from '@angular/core'
import { Observable } from 'rxjs'
import { copy} from 'x-utils-es'
import { RxStore } from '@excel/utils';
import { ExcelStationsResp, ExcelModel, ExcelProduct, ExcelProductsResp, UpdatedStation } from '@excel/interfaces';


interface IState {
    /** last updated station from map-item */
    updatedStation: UpdatedStation,
    excelStations: ExcelStationsResp;
    selectedSearchResults: {
        data: ExcelModel[]
        // so the state is alwasy new
        index?: number
    }
    excelProducts: ExcelProduct[]
}


const initialState: IState = {
    excelProducts: undefined,
    updatedStation: undefined,
    excelStations: undefined,
    selectedSearchResults: undefined
}


@Injectable({
    providedIn: 'root',
})
export class ExcelStates extends RxStore<IState> {
    constructor() {
        super(initialState, { debug: isDevMode() })
    }

    setExcelProducts(data: ExcelProductsResp): void{
        this.setState({ excelProducts: data?.response})
    }

    setUpdatedStation(data:UpdatedStation ): void {
        data.station = data.station ? copy(data.station):undefined
        this.setState({ updatedStation: data})
    }

    setExcelStations(data: ExcelStationsResp): void {
        this.setState({ excelStations: copy(data) })
    }

    get excelProducts$(): Observable<ExcelProduct[]>{
        return this.select((state) => {
            return state.excelProducts
        })
    }
    /** last updated station from map-item */
    get updatedStation$(): Observable<UpdatedStation> {
        return this.select((state) => {
            return state.updatedStation
        })
    }

    get excelStations$(): Observable<ExcelModel[]> {
        return this.select((state) => {
            return state.excelStations?.response
        })
    }

    /** provide any number of ExcelModel items in an array */
    setSelectedSearchResults(items: ExcelModel[]): void {
        // make sure state is never equal
        let index = Number(this.getState().selectedSearchResults?.index) || 0;
        index++

        this.setState({ selectedSearchResults: {data: copy(items), index }})
    }

    get selectedSearchResults$(): Observable<ExcelModel[]> {
        return this.select((state) => {
            return state.selectedSearchResults?.data
        })
    }
}
