
/**
 * NOTE This is my own RX store implementation, and use on other angular projects
 * - Implements RxStore logic, used to store data instead of new http request.
 */

import { Injectable, isDevMode } from '@angular/core'

import { Observable } from 'rxjs'
import { copy} from 'x-utils-es'
import { RxStore } from '@excel/utils';
import { ExcelStationsResp, ExcelModel } from '@excel/interfaces';


interface IState {
    /** last updated station from map-item */
    updatedStation: ExcelModel,
    excelStations: ExcelStationsResp;
    selectedSearchResults: {
        data: ExcelModel[]
        // so the state is alwasy new
        index?: number
    }
}


const initialState: IState = {
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

    setUpdatedStation(data: ExcelModel): void {
        this.setState({ updatedStation: copy(data) })
    }

    setExcelStations(data: ExcelStationsResp): void {
        this.setState({ excelStations: copy(data) })
    }

    /** last updated station from map-item */
    get updatedStation$(): Observable<ExcelModel> {
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
