export type ExcelProductPoinStatus = 'available' | 'not_available'

export interface ExcelPrice {
     /** editable */
    price: number;
     /** non editable */
    currency: string;
    /** non editable */
    product_id: string;
}
export interface ExcelProductPoint {
    id: string
    status: ExcelProductPoinStatus
}

export interface ExcelProduct {
    product_id: string
    points: ExcelProductPoint[]
}

export interface ExcelModel {
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
    prices: ExcelPrice[]
    products: ExcelProduct[]
}

export interface ExcelUpdate{
    product_id: string;
    name: string;
    price: number;
}

export interface AuthCreds{
    username: string;
    password?: string;
}
