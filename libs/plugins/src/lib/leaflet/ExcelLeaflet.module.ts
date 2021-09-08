import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {LeafletComponent} from './leaflet.component'
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { StationMapUpdateComponent, SharedComponentsModule } from '@excel/components';
import {MatCardModule} from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
@NgModule({
  declarations: [LeafletComponent, StationMapUpdateComponent],
  imports: [
    MatProgressSpinnerModule,
    SharedComponentsModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
   LeafletModule,
   CommonModule,
  ],
  exports: [LeafletComponent, StationMapUpdateComponent]
})
export class ExcelLeafletModule { }
 