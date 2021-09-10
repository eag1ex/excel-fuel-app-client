import { Marker } from 'leaflet'
import { AuthCreds, ExcelModel, ExcelPrice, ExcelProduct, ExcelProductPoint } from './excel.interface'

export type AvailRoutes = 'locations' | 'login'

export interface ENV {
    production: boolean
    serviceWorker: boolean
    /** REVIEW Update our api in production  */
    apiBaseUrl: string
    user: ExcelUser
}

/** store go to routes, available locations */
export type ToLocations = 'locations'

export interface LatLng {
    lat: number
    lng: number
}

export interface SelectedMapItem {
    station: ExcelModel
    marker: Marker
}

export interface StationFormValues {
    formName: string
    formPrices: [string]
    formProduct_ids: [string]
}

export interface CreateStationFormValues {
    formName: string
    formCity: string
    formAddress: string
    formLatitude: number
    formLongitude: number
    /** from string to values */
    formSetPrices: [string]
    formPriceIDS: [string]
    formProducts: ExcelProduct[]
    /** these are the values we consider when updating products */
    formProductsUpdated?: ExcelProduct[]
}

export type FormStatus = 'INITIAL' | 'SUBMITTED' | 'ERROR'

export interface ExcelProductDetail extends ExcelPrice {
    points: ExcelProductPoint[]
}

export interface LocationEvents {
    eventName: 'CLOSE_STATION_MAP'
    data?: any
}

export interface Iicon {
    name: string
    path: string
}
export interface RouteItem {
    /** Nice name */
    name: string
    /** route value */
    value: AvailRoutes
    /** route id, internal  */
    id: number
    /** custom ref */
    ref?: string
}

export interface ExcelStationsResolver extends RouteItem {
    data: ExcelModel[]
}

export type DeletageSteps = 'NEW' | 'UPDATE' | 'DELETE' | 'CANCEL'
export type UserPermType = 'ADMINISTRATOR' | 'BASIC'

export interface ExcelUser extends AuthCreds {
    /** {username} is stored here and in localStorage */
    username: string
    /** {token} generated by server is stored here and in localStorage */
    token: string
    type: UserPermType
}

export interface UpdatedStation {
    delete_id?: string
    add_station_id?: string
    /** if we have (new) create station component open, at the same time we open update statation component, we want to close (previous action) for create station component  */
    close_create_stataion?:boolean;
    station: ExcelModel
    marker?: Marker
}
