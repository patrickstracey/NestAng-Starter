import {UserInterface} from "./user.interface";
import {PermissionEnum} from "../enums";

export interface LoginInterface {
  email: string;
  password: string;
}

export interface SignupInterface extends LoginInterface {
  passwordConfirm: string;
}

export interface SessionInterface {
  access_token: string;
  account: UserInterface;
  permission: PermissionEnum;
}

export interface CookieInterface {
  access_token?: string;
}

export interface TokenInterface {
  uid: string;
  acc: PermissionEnum.USER | PermissionEnum.ADMIN;
}
