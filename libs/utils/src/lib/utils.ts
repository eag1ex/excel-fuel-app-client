import { defaultCurrency, routeList } from '@excel/data'
import {
    AvailRoutes,
    LatLng,
    ExcelModel,
    RouteItem,
    StationFormValues,
    CreateStationFormValues,
    ExcelPrice,
    ExcelProduct,
    ExcelUser,
    UpdatedStation,
    DeletageSteps,
} from '@excel/interfaces'
import { copy, matched, isFalsy, truthFul, objectSize } from 'x-utils-es'

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

/** make delegate stepping process to be used with switch/case for our location update routing */
export const delegateSteps = (stationUpdate: UpdatedStation): DeletageSteps[] => {
    const { station, delete_id, add_station_id, close_create_stataion } = stationUpdate || {}
    return [
        !isFalsy(station) && !delete_id && !add_station_id ? 'UPDATE' : null,
        delete_id && isFalsy(station) && !add_station_id ? 'DELETE' : null,
        !isFalsy(station) && add_station_id ? 'NEW' : null,
        isFalsy(station) && close_create_stataion ? 'CANCEL' : null,
    ].filter((n) => !!n) as DeletageSteps[]
}

/** parse json and get user details */
export const localStorageGetUser = (storageName: string): ExcelUser => {
    if (!storageName) return undefined
    try {
        return JSON.parse(localStorage.getItem(storageName))
    } catch (err) {
        return undefined
    }
}

/** detect device */
export const isMobile = (navigator: Navigator) => {
    const toMatch = [
      /Android/i,
      // webOS/i,
      /iPhone/i,
      /iPad/i,
      // iPod/i,
      /BlackBerry/i,
      /Windows Phone/i,
    ];
    return toMatch.some((toMatchItem): any => {
      return navigator.userAgent.match(toMatchItem);
    });
  };


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

/** create format for http request */
export const toExcelUpdate = (formValues: StationFormValues): ExcelModel => {
    if (!formValues) return undefined

    const allAreSet = [formValues.formName, formValues.formPrices, formValues.formProduct_ids].filter((n) => !isFalsy(n))
    if (allAreSet.length !== 3) return undefined

    // pair index offset by 1
    const priceStacks: ExcelPrice[] = [formValues.formPrices, formValues.formProduct_ids].reduce((n, el, inx) => {
        if (formValues.formPrices[inx] && formValues.formProduct_ids[inx]) {
            const prices = {
                currency: defaultCurrency,
                price: formValues.formPrices[inx],
                product_id: formValues.formProduct_ids[inx],
            }
            n.push(prices)
        }

        return n
    }, [])

    const partialUpdateModel = {
        name: formValues.formName,
        prices: priceStacks.filter((n) => !!n),
    } as ExcelModel

    return partialUpdateModel
}

/**
 * create format for http request,
 * - no validation on check for false values
 * - products are optional
 */
export const toExcelCreate = (formValues: CreateStationFormValues): ExcelModel => {
    if (isFalsy(formValues)) return undefined
    if (!objectSize(truthFul(formValues))) return undefined

    const { formLatitude, formLongitude, formAddress, formCity, formName, formSetPrices, formPriceIDS, formProducts, formProductsUpdated } = formValues

    const allAreSet = [formLatitude, formLongitude, formAddress, formCity, formName, formSetPrices, formPriceIDS].filter((n) => !isFalsy(n))

    if (allAreSet.length !== 7) return undefined

    // pair index offset by 1
    const productStacks: ExcelProduct[] = (formProducts.length ? [formProducts, formProductsUpdated] : []).reduce((n, el, inx) => {
        if (!isFalsy(formProductsUpdated[inx])) n.push(formProductsUpdated[inx])
        else n.push(formProducts[inx])
        return n
    }, [])

    // pair index offset by 1
    const priceStacks: ExcelPrice[] = [formPriceIDS, formSetPrices].reduce((n, el, inx) => {
        if (formPriceIDS[inx] && formSetPrices[inx]) {
            const prices = {
                currency: defaultCurrency,
                product_id: formPriceIDS[inx],
                price: formSetPrices[inx],
            }
            n.push(prices)
        }

        return n
    }, [])

    const newModel: ExcelModel = {
        name: formName,
        address: formAddress,
        city: formCity,
        prices: priceStacks.filter((n) => !!n),
        products: productStacks.filter((n) => !!n),
        latitude: formLatitude,
        longitude: formLongitude,
    }

    return newModel
}

//

/** make compatible propt */
export const latLong = ({ latitude, longitude }): LatLng => {
    return { lat: latitude, lng: longitude }
}

export const currentRoute = (routeValue: AvailRoutes, ref?: string): RouteItem => {
    return copy(routeList).filter((n) => n.value.includes(routeValue))[0]
}

export const excelListByName = (name: string, all: ExcelModel[]): ExcelModel[] => {
    if (!all) return undefined
    if (!name) return undefined
    return all.filter((el) => matched(el.name, new RegExp(name, 'gi')))
}
