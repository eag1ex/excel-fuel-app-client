/* tslint:disable:no-console */
/**
 * @description this is our RX state management extendable class
 */
import { diff } from 'deep-object-diff'
import { isEqual } from 'lodash-es'
import { BehaviorSubject, Observable } from 'rxjs'
import { distinctUntilChanged, map } from 'rxjs/operators'
import { now, padStart } from './utils'

interface InternalOptions {
    debug: boolean
    collapsed: boolean
    prev: boolean
    next: boolean
    current: boolean
    colors: {
        prev: string
        next: string
        current: string
    }
    stackTraceOffset: 4
}

export type RxStoreOptions = Partial<InternalOptions>

// tslint:disable-next-line: ban-types
export class RxStore<T extends Object> extends Observable<T> {
    static defaultOptions: InternalOptions = {
        debug: false,
        collapsed: true,
        prev: true,
        next: true,
        current: false,
        colors: {
            prev: '#9E9E9E',
            next: '#4CAF50',
            current: '#FF0000',
        },
        stackTraceOffset: 4,
    }

    private state$: BehaviorSubject<T>
    private options: InternalOptions

    constructor(initialState: T = null, options: RxStoreOptions = {}) {
        const state = Object.assign({}, initialState)
        const state$ = new BehaviorSubject<T>(state)

        super((observer) => {
            state$.subscribe(observer)
        })

        this.state$ = state$
        this.options = { ...RxStore.defaultOptions, ...options }
    }

    /**
     * Alias for getState()
     */
    get state(): T {
        return this.getState()
    }

    /**
     * Get current state snapshot
     */
    getState(): T {
        return this.state$.getValue()
    }

    /**
     * Set new state
     *
     * @param patch full or partial state snapshot
     */
    setState(patch: Partial<T>): void {
        const state = Object.assign({}, this.state, patch)
        this.debug(state)
        this.state$.next(state)
    }

    debug(state: T): void {
        if (!this.options.debug) {
            return
        }
        const colors = this.options.colors
        const action = this.getCallerFunction()
        const timestamp = now()
        const changed = !isEqual(state, this.state)
        const notice = 'STATES ARE EQUAL'
        const stateDiff = {
            prev: changed ? diff(state, this.state) : '-',
            next: changed ? diff(this.state, state) : '-',
        }

        // depends on options, sometimes we only want to see actions flow
        const group = this.options.collapsed ? console.groupCollapsed : console.group

        group.call(console, `${timestamp} [${this.constructor.name}.${action}] ${changed ? '' : notice}`)

        if (this.options.prev) {
            console.log(`%c ${padStart('prev state:', 15, ' ')}`, `color: ${colors.prev}; font-weight: bold`, stateDiff.prev)
        }

        if (this.options.next) {
            console.log(`%c ${padStart('next state:', 15, ' ')}`, `color: ${colors.next}; font-weight: bold`, stateDiff.next)
        }

        if (this.options.current) {
            console.log(`%c ${padStart('current state:', 15, ' ')}`, `color: ${colors.current}; font-weight: bold`, state)
        }

        console.groupEnd()
    }

    /**
     * Custom operator, let you easily work with store member
     *
     * @param selector mapping function
     */
    select<R>(selector: (state: T) => R): Observable<R> {
        return this.pipe(map(selector), distinctUntilChanged(isEqual))
    }

    /**
     * Setup options for this store, basically to provide options for middlewares
     * eg. { debug: true }
     *
     * previously declared instance options will be respect and won't be replaced
     * this allow you to declare store level options
     *
     * @param options plain object contains global options for all store
     */
    configure(options: RxStoreOptions): void {
        this.options = Object.assign({}, options, this.options)
    }

    private getCallerFunction(): string {
        const offset = RxStore.defaultOptions.stackTraceOffset
        let action = '[unknown]'
        try {
            throw new Error()
        } catch (e) {
            try {
                action = e.stack.split('at ')[offset].split(' ')[0].match(/\w+$/)[0]
                // console.log(e.stack);
            } catch (e) {}
        }
        return action
    }
}
