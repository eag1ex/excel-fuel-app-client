import { ExcelModel } from './excel.interface';


export interface ExcelStationsResp{
    response: ExcelModel[];
    code?: number
}

export interface ExcelItemResp{
    response: ExcelModel;
    code?: number
}
export interface ExcelDeleteResp{
    response: Array<string>;
    code?: number
}