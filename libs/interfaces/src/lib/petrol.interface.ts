export type PetrolProductPoinStatus = 'available' | 'not_available'

export interface PetrolPrice {
     /** editable */
    price: number;
     /** non editable */
    currency: string;
    /** non editable */
    product_id: string;
}
export interface PetrolProductPoint {
    id: string
    status: PetrolProductPoinStatus
}

export interface PetrolProduct {
    product_id: string
    points: PetrolProductPoint[]
}

export interface PetrolModel {
    /** server assigned */
    id?: string
    /** user can update */
    name: string
    address: string
    city: string
    latitude: number
    longitude: number;
    /** server assigned */
    updated_at?: Date | string;
    /** server assigned */
    created_at?: Date | string;
    /** user can update */
    prices: PetrolPrice[]
    products: PetrolProduct[]
}

export interface PetrolUpdate{
    product_id: string;
    name: string;
    price: number;
}
