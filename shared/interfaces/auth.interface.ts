import { UserInterface } from "./user.interface";
import { PermissionEnum } from "../enums";
import { AclInterface } from "./acl.interface";

export interface LoginInterface {
  email: string;
  password: string;
}

export interface SignupInterface extends LoginInterface {
  organization_name?: string;
  passwordConfirm: string;
}

export interface SessionInterface {
  access_token: string;
  user: UserInterface;
  acl_active: AclInterface | null;
  acl_list: AclInterface[];
}

export interface CookieInterface {
  access_token: string;
}

export interface TokenInterface {
  uid: string;
  oid: string | undefined;
  acc: PermissionEnum.USER | PermissionEnum.ADMIN;
}
