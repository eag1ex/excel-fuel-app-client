import { NgModule } from '@angular/core';
import { MaterialModule } from '@pl/material';
import { LayoutComponent } from './layout/layout.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { FooterComponent } from './footer/footer.component';
import { IconsComponent } from './icons/icons.component';
import { CommonModule } from '@angular/common';
import { SearchComponent } from './search/search.component'
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    LayoutComponent,
    NavBarComponent,
    FooterComponent,
    IconsComponent,
    SearchComponent,

  ],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    MaterialModule
  ],
  exports: [
    LayoutComponent,
    SearchComponent
  ]
})
export class ComponentsModule { }
