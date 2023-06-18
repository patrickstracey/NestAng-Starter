import { BaseInterface } from "./base.interface";
import { TypesEnum } from "../enums";

export interface OrganizationInterface extends BaseInterface {
  type: TypesEnum.ORGANIZATION;
}

export interface BaseOrganizationInterface {
  name: string;
  date_created: Date;
  type: TypesEnum.ORGANIZATION;
}