
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Iicon } from '@excel/interfaces';

type Offset = 'mt-1'| 'mt-2' | 'mr-1' | 'mr-2'| 'mb-1'| 'mb-2' |'ml-1'| 'ml-2' 

@Component({
    selector: 'lib-icons',
    templateUrl: './icons.component.html',
    styleUrls: ['./icons.component.scss'],
})
export class IconsComponent implements OnInit, OnChanges {

    icons: Iicon[] = [
        {name: 'menu', path: 'libs/theme/assets/icons/menu_white_24dp.svg'},
        {name: 'close', path: 'libs/theme/assets/icons/close_black_24dp.svg'},
        {name: 'local_gas_station_black', path: 'libs/theme/assets/icons/local_gas_station_black_24dp.svg'},
        {name: 'local_gas_station_yellow', path: 'libs/theme/assets/icons/local_gas_station_yellow_24dp.svg'},
        {name: 'update_yellow', path: 'libs/theme/assets/icons/update_yellow_24dp.svg'},
        {name: 'account_circle', path: 'libs/theme/assets/icons/account_circle_white_24dp.svg'},

    ]

    item: Iicon
    constructor() {}
    /** custom class, or any onther global class */
    @Input() className?:string
    @Input() icon: string
    @Input() size?: number
    @Input() offset?:Offset

    ngOnChanges(changes: SimpleChanges) {
        if (changes?.icon?.currentValue) {
            this.item = this.icons.filter((n) => n.name === this.icon)[0] || undefined
        }
       
    }
    ngOnInit(): void {}

}
