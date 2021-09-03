import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {LeafletComponent} from './leaflet.component'
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { MapItemComponent, SharedComponentsModule } from '@pl/components';
import {MatCardModule} from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
// import { IconsComponent } from 'libs/components/src/lib/icons/icons.component';


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
export class PLLeafletModule { }
