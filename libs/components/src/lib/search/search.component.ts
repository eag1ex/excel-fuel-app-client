/**
 * @description display items from search dropdown
 * - add selected item to state management
 */

import { Component, ElementRef, Input, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes'
import { FormControl } from '@angular/forms'
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete'
import { Observable } from 'rxjs'
import { filter, map, retry, startWith, tap } from 'rxjs/operators'
import {  ExcelModel } from '@excel/interfaces'
import { excelListByName } from '@excel/utils';
import { ExcelStates } from '@excel/states';
import { delay,  unsubscribe } from 'x-utils-es';

@Component({
    selector: 'lib-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit, OnDestroy {
    initialAdd = false
    subscriptions = []
    separatorKeysCodes: number[] = [ENTER, COMMA]
    searchCtrl = new FormControl()
    filteredItems: Observable<ExcelModel[]>
    searchStations: ExcelModel[]
    /** loaded and selected item*/
    items: ExcelModel[] = []

    constructor(private states: ExcelStates) {
        this.filteredItems = this.searchCtrl.valueChanges.pipe(
            filter((n) => this.searchStations !== undefined),
            // tslint:disable-next-line: deprecation
            startWith(null),
            // show filtered results or all if not typed
            map((str: string | null) => (str ? excelListByName(str, this.listDiff.slice()) : this.listDiff?.slice())),
            retry(1)
        )
    }

    @Input() searchStations$: Observable<ExcelModel[]>
    @ViewChild('nameInput') nameInput: ElementRef<HTMLInputElement>

    // list only items not yet selected
    get listDiff(): ExcelModel[] {
        if (!this.searchStations) return undefined
        return this.searchStations?.filter((x) => (this.items?.length ? this.items.filter((y) => x.id === y.id).length === 0 : true))
    }

 
    /** on item added clear last input value */
    public added(input: HTMLInputElement): void {
        input.value = ''
    }

    /** on click send request to leaflet to go to selected station */
    public chipOnClick(el: ExcelModel){
        this.states.setSelectedSearchResults([el])
    }

    public remove(el: ExcelModel, inx: number): void {
        this.items.splice(inx, 1)
        this.states.setSelectedSearchResults(this.items)
    }

    /** update last selection */
    public onUpdate(event: any): void {
        this.searchCtrl.setValue(null)
    }

    public selected(event: MatAutocompleteSelectedEvent): void {
        const item: ExcelModel = event.option.value
        this.nameInput.nativeElement.value = ''
        if (!item) return
        this.items.push(item)

        // NOTE  add/reset chosen item/s to our state managment so we can offer results to Leaflet map
        this.states.setSelectedSearchResults(this.items)
        this.searchCtrl.setValue(null)
    }


    /** on real time update make change to selected chip items */
    itemsUpdate(list: ExcelModel[]): void {
        const match = (id): ExcelModel => list.filter((n) => n.id === id)[0]

        if (this.items?.length) {
            this.items = this.items.map((station) => {
                const latest = match(station.id)
                if (latest) station = latest
                return station
            })
        }
    }

    /** on live update remove old non existing items*/
    itemsRemoveSelected(n: ExcelModel[]): void{
         const match = (item: ExcelModel) => n.filter(x => x.id === item.id).length

         this.items.forEach((item, inx) => {
             if (!match(item)) this.items.splice(inx, 1)
         })
    }

    ngOnInit(): void {
        let initial = true
        if (this.searchStations$){
           const s0 = this.searchStations$.subscribe(n => {
                if (n){

                    this.searchStations = n
                    this.itemsRemoveSelected(n)
                    this.itemsUpdate(n)
                    this.initialAddItems()
                    // also send update to the map
                    if (!initial) {
                        // NOTE need delay to make sure its send last, and after any selection changes
                        delay(200).then(() => {
                            this.states.setSelectedSearchResults(this.items)
                        })

                    }
                    initial = false
                    this.searchCtrl.setValue(null)
                }
            })
           this.subscriptions.push(...[s0])
        }
    }

    /** add 1 item to selected results */
    initialAddItems(){
        if(!this.initialAdd && this.searchStations[0]){
            this.items.push(this.searchStations[0])
            this.states.setSelectedSearchResults(this.items)
            this.searchCtrl.setValue(null)
            this.initialAdd = true
        }
    }



    ngOnDestroy(): void{
        unsubscribe(this.subscriptions, 'SearchComponent')
    }
}
