/**
 * @description display items from search dropdown
 * - add selected item to state management
 */

import { Component, ElementRef, Input, OnInit, ViewChild, SimpleChanges, OnChanges } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes'
import { FormControl } from '@angular/forms'
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete'
import { Observable } from 'rxjs'
import { filter, map, startWith, tap } from 'rxjs/operators'
import {  PetrolModel } from '@pl/interfaces'
import {  log } from 'x-utils-es'
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
            map((str: string | null) => (str ? petrolListByName(str, this.listDifference) : this.listDifference?.slice()))
        )
    }

    @Input() searchList: PetrolModel[]
    @ViewChild('nameInput') nameInput: ElementRef<HTMLInputElement>

    // list only items not yet selected
    get listDifference(): PetrolModel[]{
        return this.searchList.filter(x => this.items.length ? this.items.filter(y => x.id !== y.id).length : true)
    }

    /** on item added clear last input value */
    public added(input: HTMLInputElement): void {
        input.value = ''
    }

   public remove(el: PetrolModel, inx: number): void {
        const deleted = this.items.splice(inx, 1)
        log('removed item', deleted)
    }

    public selected(event: MatAutocompleteSelectedEvent): void {

        const item: PetrolModel = event.option.value
        this.nameInput.nativeElement.value = ''
        if (!item) return
        this.items.push(item)
        this.states.setSelectedSearchResults(this.items)

        this.searchCtrl.setValue(null)
    }


    ngOnChanges(changes: SimpleChanges): void {
        if (changes?.searchList?.currentValue) {
           // this.items = copy(this.searchList)
        }
    }

    ngOnInit(): void {}
}
