import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocationsComponent } from './locations.component';
import { RouterModule, Routes } from '@angular/router';
import { ComponentsModule } from '@excel/components';
import { ExcelLeafletModule } from '@excel/plugins';

const ROUTES: Routes = [{ path: '', component: LocationsComponent }];

@NgModule({
  declarations: [LocationsComponent],
  imports: [
    ExcelLeafletModule,
    ComponentsModule,
    CommonModule,
    RouterModule.forChild(ROUTES)
  ]
})
export class LocationsModule { }



