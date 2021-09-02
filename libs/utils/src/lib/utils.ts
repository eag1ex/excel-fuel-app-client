import { routeList } from '@pl/data'
import { AvailRoutes, RouteItem } from '@pl/interfaces'
import { copy } from 'x-utils-es'



export const currentRoute = (routeValue: AvailRoutes, ref?: string): RouteItem => {
    return copy(routeList).filter((n) => n.value.includes(routeValue))[0]
}