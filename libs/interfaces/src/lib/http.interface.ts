import { ExcelModel } from './excel.interface';


export interface ExcelListResp{
    response: ExcelModel[];
    code: number
}

export interface ExcelItemResp{
    response: ExcelModel;
    code: number
}
export interface ExcelDeleteResp{
    response: Array<string>;
    code: number
}