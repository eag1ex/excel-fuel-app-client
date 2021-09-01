import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
const routes: Routes = [
  {
      path: 'locations',
      loadChildren: () => import('./locations/locations.module').then((mod) => mod.LocationsModule),
      runGuardsAndResolvers: 'paramsChange',
  }
];

@NgModule({
  declarations: [
  ],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],

})
export class PageRoutesModule { }
