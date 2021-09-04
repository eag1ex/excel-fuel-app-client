import { routeList } from '@pl/data'
import { AvailRoutes, LatLng, PetrolModel, RouteItem } from '@pl/interfaces'
import { copy, log, matched } from 'x-utils-es'


export const repeat = (str, times) => new Array(times + 1).join(str)
export const padStart = (num, maxLength, char = ' ') => repeat(char, maxLength - num.toString().length) + num

export const formatTime = (time) => {
    const h = padStart(time.getHours(), 2, '0')
    const m = padStart(time.getMinutes(), 2, '0')
    const s = padStart(time.getSeconds(), 2, '0')
    const ms = padStart(time.getMilliseconds(), 3, '0')
    return `${h}:${m}:${s}.${ms}`
}

export const now = () => formatTime(new Date())



/** make compatible propt */
export const latLong = ({latitude, longitude}): LatLng => {
    return {lat: latitude, lng: longitude}
}

export const currentRoute = (routeValue: AvailRoutes, ref?: string): RouteItem => {
    return copy(routeList).filter((n) => n.value.includes(routeValue))[0]
}


export const petrolListByName = (name: string, all: PetrolModel[]): PetrolModel[] => {
    if (!all) return undefined
    if (!name) return undefined
    return all.filter((el) => matched(el.name, new RegExp(name, 'gi') ))
}

