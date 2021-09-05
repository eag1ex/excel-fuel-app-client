import { ExcelModel } from './excel.interface';

export type AvailRoutes = 'locations' | 'login'

export interface ENV{
    production: boolean;
    serviceWorker: boolean;
    /** REVIEW Update our api in production  */
    apiBaseUrl: string;
    user: PLUser;
}

/** store go to routes, available locations */
export type ToLocations = 'locations'

export interface LatLng {
    lat: number
    lng: number
}

export interface Iicon{
    name: string; path: string;
}
export interface RouteItem{
    /** Nice name */
    name: string;
    /** route value */
    value: AvailRoutes;
    /** route id, internal  */
    id: number;
    /** custom ref */
    ref?: string
}


export interface ExcelListResolver extends RouteItem{
    data: ExcelModel[]
}

export type UserPermType = 'ADMINISTRATOR' | 'BASIC'

export interface PLUser{
     /** {username} is stored here and in localStorage */
    username: string;
    /** {token} generated by server is stored here and in localStorage */
    token: string
    type: UserPermType
}