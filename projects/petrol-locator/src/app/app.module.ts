import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ServiceWorkerModule } from '@angular/service-worker';
import { debug, disableLogging } from 'x-utils-es';
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '@pl/material';
import { AppRoutingModule } from './app.routing.module';
import { PLbackendProvider } from '@pl/http';
import { ComponentsModule } from '@pl/components';
import { MainComponent } from './main/main.component';
if (environment.production === true) {
    debug(`-- Using Angular 11.x --`);
    debug(`-- CONSOLE LOGS DISABLES --`);
    // tslint:disable-next-line: only-arrow-functions
    console.log = function() {};
    disableLogging();
}

@NgModule({
  declarations: [
    AppComponent, MainComponent
  ],
  imports: [
    ComponentsModule,
    AppRoutingModule,
    MaterialModule,
    BrowserAnimationsModule,
    HttpClientModule,
    BrowserModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
  }),
  ],
  providers: [
    PLbackendProvider,
    {
      provide: 'ENVIRONMENT_PRODUCTION',
      useValue: environment.production,
  },
  {
    provide: 'USER',
    useValue: environment.user,
  },
  {
      provide: 'ENVIRONMENT',
      useValue: environment,
  },
  {
      provide: 'API_BASE_URL',
      useValue: environment.apiBaseUrl,
  },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
