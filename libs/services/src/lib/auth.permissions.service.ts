/**
 * @description check current user pormission status
 * - This is a simple implementation
 * - extended with RxStore to add extra func.
 */

import { Injectable, isDevMode } from '@angular/core'
import { ExcelUser, ToLocations } from '@excel/interfaces'
import { localStorageGetUser, RxStore } from '@excel/utils'
import { Observable } from 'rxjs'
import { copy, isFalsy } from 'x-utils-es'

interface IState {
    user: ExcelUser
}

const initialState = {
    user: undefined,
}

@Injectable({
    providedIn: 'root',
})
export class AuthPermissionsService extends RxStore<IState> {
    /** global access  */
    user: ExcelUser

    /** store last route where canLoad guard is set*/
    toLocation: ToLocations
    constructor() {
        super(initialState, { debug: isDevMode() })
    }

    /**
     * Set new user state, also update localStorage
     */
    setUser(user: ExcelUser): void {
        this.user = user
        localStorage.setItem('excel-user', JSON.stringify(user) || '')
        this.setState({ user: copy(user) })
    }

    /** return user from start or from localStore */
    get user$(): Observable<ExcelUser> {
        return this.select((state) => {
            const user: ExcelUser = localStorageGetUser('excel-user')
            if (isFalsy(user)) return state.user
            else return user
        })
    }
}
