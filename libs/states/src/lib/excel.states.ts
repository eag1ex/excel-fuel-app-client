
/**
 * NOTE This is my own RX store implementation, and use on other angular projects
 * - Implements RxStore logic, used to store data instead of new http request.
 */

import { Injectable, isDevMode } from '@angular/core'

import { Observable } from 'rxjs'
import { copy} from 'x-utils-es'
import { RxStore } from '@excel/utils';
import { ExcelListResp, ExcelModel } from '@excel/interfaces';



interface IState {
    excelList: ExcelListResp;
    selectedSearchResults: {
        data: ExcelModel[]
        // so the state is alwasy new
        index?: number
    }
}

const initialState: IState = {
    excelList: undefined,
    selectedSearchResults: undefined
}


@Injectable({
    providedIn: 'root',
})
export class ExcelStates extends RxStore<IState> {
    constructor() {
        super(initialState, { debug: isDevMode() })
    }

    setExcelList(data: ExcelListResp): void {
        this.setState({ excelList: copy(data) })
    }

    get excelList$(): Observable<ExcelModel[]> {
        return this.select((state) => {
            return state.excelList?.response
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
