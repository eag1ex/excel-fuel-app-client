import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocationsComponent } from './locations.component';
import { RouterModule, Routes } from '@angular/router';
import { ComponentsModule } from '@pl/components';
import { PLLeafletModule } from 'pl/plugins';

const ROUTES: Routes = [{ path: '', component: LocationsComponent }];

@NgModule({
  declarations: [LocationsComponent],
  imports: [
    PLLeafletModule,
    ComponentsModule,
    CommonModule,
    RouterModule.forChild(ROUTES)
  ]
})
export class LocationsModule { }



