import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { AuthGuardService } from '@pl/services';
import { environment } from '../environments/environment';
import { AuthComponent } from './auth/auth.component';
import { MainComponent } from './main/main.component';

const routes: Routes = [
  // improvise authentication
  // this component route can redirect back to > app/locations
  {
    path: 'app/auth',
    component: AuthComponent,
    data: {
      user: environment.user
    }
  },
  {
    path: 'app',
    component: MainComponent,
    loadChildren: () =>
      import('@pl/page-routes').then((mod) => mod.PageRoutesModule),
      canLoad: [AuthGuardService]
  },
  {
    path: '',
    redirectTo: `app/locations`,
    pathMatch: 'full',
  },
  { path: '**', redirectTo: 'app/auth', pathMatch: 'full' },
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
