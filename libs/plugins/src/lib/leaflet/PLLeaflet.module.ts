import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {LeafletComponent} from './leaflet.component'
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { MapItemComponent } from '@pl/components';
import {MatCardModule} from '@angular/material/card';
@NgModule({
  declarations: [LeafletComponent, MapItemComponent],
  imports: [
    MatCardModule,
   LeafletModule,
   CommonModule,
  ],
  exports: [LeafletComponent, MapItemComponent]
})
export class PLLeafletModule { }
