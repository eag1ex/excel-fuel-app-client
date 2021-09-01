
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Iicon } from '@pl/interfaces';

@Component({
    selector: 'lib-icons',
    templateUrl: './icons.component.html',
    styleUrls: ['./icons.component.scss'],
})
export class IconsComponent implements OnInit, OnChanges {

    icons: Iicon[] = [
        {name: 'menu', path: 'libs/theme/assets/icons/menu_white_24dp.svg'},
    ]
    item: Iicon
    constructor() {}

    @Input() icon: string
    @Input() size?: number

    ngOnChanges(changes: SimpleChanges) {
        if (changes.icon.currentValue) {
            this.item = this.icons.filter((n) => n.name === this.icon)[0] || undefined
        }
    }
    ngOnInit(): void {}

}
