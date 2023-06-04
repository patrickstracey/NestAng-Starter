import { BaseInterface } from "./base.interface";
import { TypesEnum } from "../enums";

export interface UserInterface extends BaseInterface, BaseUserInterface {
  type: TypesEnum.USER;
}

export interface BaseUserInterface {
  type: TypesEnum.USER;
  name: string;
  email: string;
  phone: string;
  password?: string;
  payments_id?: string;
  date_created?: Date;
}
