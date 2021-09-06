import { routeList } from '@excel/data'
import { AvailRoutes, LatLng, ExcelModel, RouteItem, ExcelProductDetail, ExcelUpdate, StationFormValues } from '@excel/interfaces'
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


/** make html marker content, popup */
export const makeMarkerPopUp = (metadata: ExcelModel): string => {
    const list = (el) => `<li class="border-none list-group-item list-group-item-light p-0">${el}</li>`

    const items: Array<string> = [
        metadata.name ? { value: metadata.name } : null,
        // metadata.city ? { value: 'City: ' + metadata.city } : null,
        // metadata.address ? { value: 'Address: ' + metadata.address } : null,
    ]
        .filter((n) => !!n)
        .map((n) => n.value)
        .map((n) => list(n))

    let htmlList = ''

    for (let inx = 0; inx < items.length; inx++) htmlList += items[inx]
    return `
            <ul class="list-group p-0">
                ${htmlList}
            </ul> `
}


/** construct update format for http request */
export const toExcelUpdate = (formValues: StationFormValues): ExcelUpdate[] => {
    if(!formValues) return undefined
    let size = formValues?.formProduct_ids?.length ||0
    let data: ExcelUpdate[] = []
    // NOTE we use the same name value in the loop, not ideal, ok for now
    for (let inx = 0; inx < Array(size).length; inx++) {
        data.push({ name: formValues.formName, price: formValues.formPrices[inx] as any, product_id: formValues.formProduct_ids[inx] })
    }
    return data
}

/** make compatible propt */
export const latLong = ({latitude, longitude}): LatLng => {
    return {lat: latitude, lng: longitude}
}

export const currentRoute = (routeValue: AvailRoutes, ref?: string): RouteItem => {
    return copy(routeList).filter((n) => n.value.includes(routeValue))[0]
}


export const excelListByName = (name: string, all: ExcelModel[]): ExcelModel[] => {
    if (!all) return undefined
    if (!name) return undefined
    return all.filter((el) => matched(el.name, new RegExp(name, 'gi') ))
}

