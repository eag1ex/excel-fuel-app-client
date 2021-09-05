import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {LeafletComponent} from './leaflet.component'
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { MapItemComponent, SharedComponentsModule } from '@excel/components';
import {MatCardModule} from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@NgModule({
  declarations: [LeafletComponent, MapItemComponent],
  imports: [
    SharedComponentsModule,
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
   LeafletModule,
   CommonModule,
  ],
  exports: [LeafletComponent, MapItemComponent]
})
export class ExcelLeafletModule { }
