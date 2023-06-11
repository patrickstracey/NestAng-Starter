import { TypesEnum } from "../enums";
import { ObjectId } from "../types";

export interface PasswordResetInterface {
  _id?: ObjectId | string;
  type: TypesEnum.PASSWORD_RESET;
  id_account: ObjectId;
  email: string;
  created: Date;
  expires: Date;
}
