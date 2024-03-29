import { NgModule } from '@angular/core';
import { MaterialModule } from '@excel/material';
import { LayoutComponent } from './layout/layout.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { FooterComponent } from './footer/footer.component';
import { CommonModule } from '@angular/common';
import { SearchComponent } from './search/search.component'
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedComponentsModule } from './shared.components.module';
import { StationMapCreateComponent } from './station-map-create/station-map-create.component';

@NgModule({
  declarations: [
    LayoutComponent,
    NavBarComponent,
    FooterComponent,
    SearchComponent,
    StationMapCreateComponent
  ],
  imports: [

    SharedComponentsModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    MaterialModule
  ],
  exports: [
    LayoutComponent,
    SearchComponent,
    StationMapCreateComponent
  ]
})
export class ComponentsModule { }
