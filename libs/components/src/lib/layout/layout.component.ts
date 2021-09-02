import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { PetrolListResolver } from '@pl/interfaces'
import { log } from 'x-utils-es'

@Component({
    selector: 'lib-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit {
    constructor() {

    }


    ngOnInit(): void {}
}
