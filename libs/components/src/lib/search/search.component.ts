/**
 * @description display items from search dropdown
 * - add selected item to state management
 */

import { Component, ElementRef, Input, OnInit, ViewChild, SimpleChanges, OnChanges } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes'
import { FormControl } from '@angular/forms'
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete'
import { Observable } from 'rxjs'
import { filter, map, retry, startWith, tap } from 'rxjs/operators'
import {  PetrolModel } from '@pl/interfaces'
import {  delay, log } from 'x-utils-es'
import { petrolListByName } from '@pl/utils';
import { PLstates } from '@pl/states';

@Component({
    selector: 'lib-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit, OnChanges {

    separatorKeysCodes: number[] = [ENTER, COMMA]
    searchCtrl = new FormControl()
    filteredItems: Observable<PetrolModel[]>

    /** loaded and selected item*/
    items: PetrolModel[] = []

    constructor(private states: PLstates) {

         this.filteredItems = this.searchCtrl.valueChanges.pipe(
            filter((n) => this.searchList !== undefined),
            // tslint:disable-next-line: deprecation
            startWith(null),
            // show filtered results or all if not typed
            map((str: string | null) => (str ? petrolListByName(str, this.listDiff.slice()) : this.listDiff?.slice())), retry(1)
        )

    }

    @Input() searchList: PetrolModel[]
    @ViewChild('nameInput') nameInput: ElementRef<HTMLInputElement>

    // list only items not yet selected
    get listDiff(): PetrolModel[]{
        return this.searchList.filter(x => this.items?.length ? this.items.filter(y => x.id === y.id).length === 0 : true)
    }

    /** on item added clear last input value */
    public added(input: HTMLInputElement): void {
        input.value = ''
    }

   public remove(el: PetrolModel, inx: number): void {
        this.items.splice(inx, 1)
        this.states.setSelectedSearchResults(this.items)
    }

    /** update last selection */
    public onUpdate(event: any): void {
        this.searchCtrl.setValue(null)
    }
    public selected(event: MatAutocompleteSelectedEvent): void {

        const item: PetrolModel = event.option.value
        this.nameInput.nativeElement.value = ''
        if (!item) return
        this.items.push(item)

        // NOTE  add/reset chosen item/s to our state managment so we can offer results to Leaflet map
        this.states.setSelectedSearchResults(this.items)
        this.searchCtrl.setValue(null)
    }


    ngOnChanges(changes: SimpleChanges): void {
        if (changes?.searchList?.currentValue) {
           // this.items = copy(this.searchList)
           this.searchCtrl.setValue(null)
        }
    }

    ngOnInit(): void {}
}
