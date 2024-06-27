import { localStorageGetUser } from '@excel/utils'

export const environment = {
    production: true,
    serviceWorker: true,
    /** REVIEW Update our api in production  */
    /** local */
    // apiBaseUrl: '/api',

    URI: 'https://wily-tomi-eag1ex-3730bf26.koyeb.app',
    /** koyeb.app remote server end point */
    apiBaseUrl: 'excel-fuel-api',
    /** give access to remote api */
    functionCode: 'DFKJ884576*_35465fdjfuyrt+_*45@%_=_*56%@!~^',
    user: localStorageGetUser('excel-user'),
}
