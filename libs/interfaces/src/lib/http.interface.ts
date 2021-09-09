import { ExcelModel, ExcelProduct } from './excel.interface'

export interface ExcelStationsResp {
    response: ExcelModel[]
    code?: number
}

export interface ExcelProductsResp {
    response: ExcelProduct[]
    code?: number
}

export interface ExcelItemResp {
    response: ExcelModel
    code?: number
}
export interface ExcelDeleteResp {
    response: Array<string>
    code?: number
}

export interface AuthResp {
    /**  Bearer {token} */
    response: { token: string }
    code?: number
}

type TError = { code: string; message: string }
export type CreateErrorCallback = (error: { error: TError } & Error) => void
