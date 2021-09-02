import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core'
import { COMMA, ENTER } from '@angular/cdk/keycodes'
import { FormControl } from '@angular/forms'
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete'
import { MatChipInputEvent } from '@angular/material/chips'
import { Observable } from 'rxjs'
import { map, startWith } from 'rxjs/operators'
import { PetrolListResolver, PetrolModel } from '@pl/interfaces'
import { ActivatedRoute } from '@angular/router'
import { log } from 'x-utils-es'

@Component({
    selector: 'lib-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
    selectable = true
    removable = true
    separatorKeysCodes: number[] = [ENTER, COMMA]
    fruitCtrl = new FormControl()
    filteredFruits: Observable<string[]>
    fruits: string[] = ['Lemon']
    allFruits: string[] = ['Apple', 'Lemon', 'Lime', 'Orange', 'Strawberry']
    constructor() {
        this.filteredFruits = this.fruitCtrl.valueChanges.pipe(
            startWith(null),
            map((fruit: string | null) => (fruit ? this._filter(fruit) : this.allFruits.slice()))
        )


    }


    @ViewChild('fruitInput') fruitInput: ElementRef<HTMLInputElement>
    add(event: MatChipInputEvent): void {
        const value = (event.value || '').trim()

        // Add our fruit
        if (value) {
            this.fruits.push(value)
        }

        // Clear the input value
        (event as any).chipInput!.clear();

        this.fruitCtrl.setValue(null)
    }

    remove(fruit: string): void {
        const index = this.fruits.indexOf(fruit)

        if (index >= 0) {
            this.fruits.splice(index, 1)
        }
    }

    selected(event: MatAutocompleteSelectedEvent): void {
        this.fruits.push(event.option.viewValue)
        this.fruitInput.nativeElement.value = ''
        this.fruitCtrl.setValue(null)
    }

    private _filter(value: string): string[] {
        const filterValue = value.toLowerCase()

        return this.allFruits.filter((fruit) => fruit.toLowerCase().includes(filterValue))
    }

    ngOnInit(): void {}
}
