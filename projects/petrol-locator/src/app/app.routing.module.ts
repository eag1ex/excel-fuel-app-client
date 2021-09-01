import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { MainComponent } from './main/main.component';
const routes: Routes = [
  {
    path: 'app',
    component: MainComponent,
    loadChildren: () =>
      import('@pl/page-routes').then((mod) => mod.PageRoutesModule),
  },
  {
    path: '',
    redirectTo: `app/locations`,
    pathMatch: 'full',
  },
  { path: '**', redirectTo: 'app/locations', pathMatch: 'full' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      initialNavigation: 'enabled',
      preloadingStrategy: PreloadAllModules,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
