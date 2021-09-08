import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { LocationsComponent } from './locations.component'
import { RouterModule, Routes } from '@angular/router'
import { ComponentsModule, SharedComponentsModule } from '@excel/components'
import { ExcelLeafletModule } from '@excel/plugins'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'

const ROUTES: Routes = [{ path: '', component: LocationsComponent }]

@NgModule({
    declarations: [LocationsComponent],
    imports: [MatButtonModule, MatIconModule, ExcelLeafletModule, ComponentsModule, SharedComponentsModule, CommonModule, RouterModule.forChild(ROUTES)],
})
export class LocationsModule {}
