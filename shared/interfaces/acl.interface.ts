import { BaseInterface } from "./base.interface";
import { PermissionEnum, TypesEnum } from "../enums";
import { ObjectId } from "../types";

export interface AclInterface extends BaseInterface, BaseAclInterface {
  type: TypesEnum.ACL;
}

export interface BaseAclInterface {
  id_user: ObjectId | string | null;
  id_organization: ObjectId | string;
  permission: PermissionEnum;
  name_user?: string;
  type: TypesEnum.ACL;
}
