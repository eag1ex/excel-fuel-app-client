export interface ENV{
    production: boolean;
    serviceWorker: boolean;
    /** REVIEW Update our api in production  */
    apiBaseUrl: string;
}


export interface Iicon{
    name: string; path: string;
}