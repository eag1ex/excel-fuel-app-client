/**
 * @description this component is used with Leaflet plugin, and it is imported to {PLLeafletModule}
 */

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'lib-map-item',
  templateUrl: './map-item.component.html',
  styleUrls: ['./map-item.component.scss']
})
export class MapItemComponent implements OnInit {
longText = `The Shiba Inu is the smallest of the six original and distinct spitz breeds of dog
  from Japan. A small, agile dog that copes very well with mountainous terrain, the Shiba Inu was
  originally bred for hunting.`;
  constructor() { }

  ngOnInit(): void {
  }

}
