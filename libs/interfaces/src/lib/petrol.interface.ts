export type PetrolProductPoinStatus = 'available' | 'not_available'

export interface PetrolPrices {
    price: number;
    currency: string;
    product_id: string;
}
export interface PetrolProductPoints {
    id: string
    status: PetrolProductPoinStatus
}

export interface PetrolProducts {
    product_id: string
    points: PetrolProductPoints[]
}

export interface PetrolModel {
    id: string
    /** user can update */
    name: string
    address: string
    city: string
    latitude: number
    longitude: number
    /** user can update */
    prices: PetrolPrices[]
    products: PetrolProducts[]
}
