// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
import { ENV } from '@excel/interfaces'
import { localStorageGetUser } from '@excel/utils'
export const environment: ENV = {
    production: false,
    serviceWorker: false,
    // apiBaseUrl: '/api',

    URI: 'https://kind-gold-armadillo-sari.cyclic.app',
    /** cyclic remote server end point */
    apiBaseUrl: 'excel-fuel-api',
    /** give access to remote api */
    functionCode: 'DFKJ884576*_35465fdjfuyrt+_*45@%_=_*56%@!~^',

    user: localStorageGetUser('excel-user'),
}

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
import 'zone.js/dist/zone-error' // Included with Angular CLI.
