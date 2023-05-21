import {BaseInterface} from "./base.interface";
import {TypesEnum} from "../enums";

export interface AccountInterface extends BaseInterface, BaseAccountInterface {
    type: TypesEnum.USER;
}

export interface BaseAccountInterface {
    type: TypesEnum.USER;
    name: string;
    email: string;
    phone: string;
    password?: string;
    payments_id?: string;
    date_created?: Date;
}