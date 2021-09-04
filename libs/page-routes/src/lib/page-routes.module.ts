import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService, PetrolListServiceResolver } from '@pl/services';
const routes: Routes = [

  {
    path: 'error',
    loadChildren: () => import('./error/error.module').then((mod) => mod.ErrorModule),
    runGuardsAndResolvers: 'paramsChange',
  },
  {
      path: 'locations',
      loadChildren: () => import('./locations/locations.module').then((mod) => mod.LocationsModule),
      runGuardsAndResolvers: 'paramsChange',
      canLoad: [AuthGuardService],
      resolve: {
        list: PetrolListServiceResolver,
    },
  },
  { path: '**', redirectTo: 'locations' },
];

@NgModule({
  declarations: [

  ],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],

})
export class PageRoutesModule { }
