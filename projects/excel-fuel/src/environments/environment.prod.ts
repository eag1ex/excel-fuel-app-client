import { localStorageGetUser } from '@excel/utils'

export const environment = {
    production: true,
    serviceWorker: true,
    /** REVIEW Update our api in production  */
    /** local */
    // apiBaseUrl: '/api',

    URI: 'https://kind-gold-armadillo-sari.cyclic.app',
    /** cyclic remote server end point */
    apiBaseUrl: '/excel-fuel-api',
    /** give access to remote api */
    functionCode: 'DFKJ884576*_35465fdjfuyrt+_*45@%_=_*56%@!~^',
    user: localStorageGetUser('excel-user'),
}
