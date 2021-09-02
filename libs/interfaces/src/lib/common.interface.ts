import { PetrolModel } from './petrol.interface';

export type AvailRoutes = 'locations' | 'login'

export interface ENV{
    production: boolean;
    serviceWorker: boolean;
    /** REVIEW Update our api in production  */
    apiBaseUrl: string;
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


export interface PetrolListResolver extends RouteItem{
    data: PetrolModel[]
}