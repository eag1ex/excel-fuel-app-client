import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {LeafletComponent} from './leaflet.component'
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { StationMapItemComponent, SharedComponentsModule } from '@excel/components';
import {MatCardModule} from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@NgModule({
  declarations: [LeafletComponent, StationMapItemComponent],
  imports: [
    SharedComponentsModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
   LeafletModule,
   CommonModule,
  ],
  exports: [LeafletComponent, StationMapItemComponent]
})
export class ExcelLeafletModule { }
