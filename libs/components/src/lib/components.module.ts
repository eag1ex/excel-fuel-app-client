import { NgModule } from '@angular/core';
import { MaterialModule } from '@pl/material';
import { LayoutComponent } from './layout/layout.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { FooterComponent } from './footer/footer.component';
import { IconsComponent } from './icons/icons.component';
// import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common'


@NgModule({
  declarations: [
    LayoutComponent,
    NavBarComponent,
    FooterComponent,
    IconsComponent
  ],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports: [
    LayoutComponent
  ]
})
export class ComponentsModule { }
