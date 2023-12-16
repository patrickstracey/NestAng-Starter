import { BaseInterface } from "./base.interface";
import { TypesEnum, UserTypesEnum } from "../enums";

export interface UserInterface extends BaseInterface, BaseUserInterface {
  type: TypesEnum.USER;
}

//old user object. We keep it until the refactor is done
export interface BaseUserInterface {
  type: TypesEnum.USER;
  name: string;
  email: string;
  phone: string;
  password?: string;
  payments_id?: string;
  date_created?: Date;
}

export interface LodgeUserInterface extends BaseInterface{
  userName:string;
  password?:string; //Note to self: Never fucking return this to FE
  logedIn:boolean; //sets to true after user solves riddle 1
  stations:Array<string>;
  finalGuess:string;
  userType: UserTypesEnum;
}
