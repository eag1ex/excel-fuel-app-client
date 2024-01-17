import { NgModule } from '@angular/core'
import { Routes, RouterModule, PreloadAllModules } from '@angular/router'
import { environment } from '../environments/environment'
import { AuthComponent } from './auth/auth.component'
import { MainComponent } from './main/main.component'

const routes: Routes = [
    {
        path: 'app',
        component: MainComponent,
        loadChildren: () => import('@excel/page-routes').then((mod) => mod.PageRoutesModule),
    },
    // improvise authentication
    // this component route can redirect back to > app/locations
    {
        path: 'auth',
        component: AuthComponent,
        data: {
            user: environment.user,
        },
    },
    { path: '', redirectTo: 'auth', pathMatch: 'full' },
]

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
