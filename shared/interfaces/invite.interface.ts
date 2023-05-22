import { TypesEnum } from "../enums";
import { BaseInterface } from "./base.interface";

export interface InviteInterface extends BaseInterface, BaseInviteInterface {
  type: TypesEnum.INVITE;
}

export interface BaseInviteInterface {
  type: TypesEnum.INVITE;
  attached_id: any;
  email?: any;
  date_created: Date;
}

export interface PasswordResetInterface {
  _id?: any;
  type: TypesEnum.PASSWORD_RESET;
  account: any;
  email: string;
  created: Date;
  expires: Date;
}
