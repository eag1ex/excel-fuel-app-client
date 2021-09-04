import { PetrolModel } from './petrol.interface';


export interface PetrolListResp{
    response: PetrolModel[];
    code: number
}

export interface PetrolItemResp{
    response: PetrolModel;
    code: number
}
export interface PetrolDeleteResp{
    response: Array<string>;
    code: number
}