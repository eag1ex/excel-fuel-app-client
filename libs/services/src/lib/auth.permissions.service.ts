/**
 * @description check current user pormission status
 * - This is a simple implementation
 * - extended with RxStore to add extra func.
 */

import { Injectable, isDevMode } from '@angular/core';
import { PLUser } from '@pl/interfaces';
import { RxStore } from '@pl/utils';
import { Observable } from 'rxjs';
import { copy, isFalsy } from 'x-utils-es';

interface IState{
    user: PLUser
}

const initialState = {
    user: undefined
}

@Injectable({
    providedIn: 'root',
})
export class AuthPermissionsService extends RxStore<IState>  {

    /** global access  */
    user: PLUser

    constructor(){
        super(initialState, { debug: isDevMode() })
    }

    /**
     * Set new user state, also update localStorage
     */
    setUser(user: PLUser): void{
        this.user = user
        localStorage.setItem('pl-user', JSON.stringify(user))
        this.setState({ user: copy(user) })
    }

    /** return user from start or from localStore */
    user$(): Observable<PLUser>{
        return this.select((state) => {
            const user: PLUser =  JSON.parse(localStorage.getItem('pl-user'))
            if (isFalsy(user)) return state.user
            else return user
        })
    }
}