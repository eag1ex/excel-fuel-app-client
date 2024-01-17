import { AuthCreds, LatLng, RouteItem } from '@excel/interfaces';

export const appTitle = 'Excel Fuel';
export const routeList: RouteItem[] = [
    { name: 'Locations', value: 'locations', id: 1, ref: undefined }
]

export const EUROPE_LAT_LNG: LatLng = {
    lat: 48.6908333333,
    lng: 9.14055555556
}

/** excel price default */
export const defaultCurrency = 'CHF'

/**
 * For demo only, not secure!
 * our hardcoded credentials, reflect those on server
 * - changing credentials will result /auth error
*/
export const credentials: AuthCreds = {
    username: 'eaglex',
    password: 'eaglex'
}