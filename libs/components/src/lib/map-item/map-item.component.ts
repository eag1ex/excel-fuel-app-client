/**
 * @description this component is used with Leaflet plugin, and it is imported to {PLLeafletModule}
 */

import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { PetrolModel } from '@pl/interfaces';
import { log } from 'x-utils-es';

@Component({
  selector: 'lib-map-item',
  templateUrl: './map-item.component.html',
  styleUrls: ['./map-item.component.scss']
})
export class MapItemComponent implements OnInit, OnChanges {
  item: PetrolModel
  constructor() { }

  @Input() selectedMapItem: PetrolModel

  ngOnChanges(changes: SimpleChanges): void{
    if (changes?.selectedMapItem?.currentValue){
      log('new item')
      this.item = this.selectedMapItem
    }
  }

  ngOnInit(): void {
  }

}
