import { PetrolModel } from './../../../interfaces/src/lib/petrol.interface';
/**
 * NOTE This is my own RX store implementation, and use on other angular projects
 * - Implements RxStore logic, used to store data instead of new http request.
 */

import { Injectable, isDevMode } from '@angular/core'

import { Observable } from 'rxjs'
import { copy, log, objectSize, onerror, isFalsy } from 'x-utils-es'
import { map, filter } from 'rxjs/operators';
import { RxStore } from '@pl/utils';
import { PetrolListResp } from '@pl/interfaces';

/** Get currernt route  */

interface IState {
    petrolList: PetrolListResp;
    selectedSearchResults: PetrolModel[]
}


const initialState: IState = {
    petrolList: undefined,
    selectedSearchResults: undefined
}

@Injectable({
    providedIn: 'root',
})
export class PLstates extends RxStore<IState> {
    constructor() {
        super(initialState, { debug: isDevMode() })
    }

    setPetrolList(data: PetrolListResp): void {
        this.setState({ petrolList: copy(data) })
    }

    get petrolList$(): Observable<PetrolModel[]> {
        return this.select((state) => {
            return state.petrolList?.response
        })
    }

    /** provide any number of PetrolModel items in an array */
    setSelectedSearchResults(items: PetrolModel[]): void {
        this.setState({ selectedSearchResults: copy(items) })
    }

    get selectedSearchResults$(): Observable<PetrolModel[]> {
        return this.select((state) => {
            return state.selectedSearchResults
        })
    }
}
