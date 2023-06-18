import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { OrganizationDto } from './organization.dto';
import { DatabaseTables, TypesEnum } from '../../../../shared/enums';
import { DatabaseService } from '../../database';
import { BaseOrganizationInterface, OrganizationInterface, TokenInterface } from '../../../../shared/interfaces';
import { AclsService } from '../acls';

@Injectable()
export class OrganizationService {
  constructor(private dbService: DatabaseService, private aclService: AclsService) {}

  private orgCollection = DatabaseTables.ORGANIZATIONS;

  get db() {
    return this.dbService.database.collection(this.orgCollection);
  }

  async create(organizationDto: OrganizationDto): Promise<OrganizationInterface> {
    const newOrg: BaseOrganizationInterface = {
      name: organizationDto.name,
      date_created: new Date(),
      type: TypesEnum.ORGANIZATION,
    };

    return (await this.dbService.insertSingleItem(this.orgCollection, newOrg)) as OrganizationInterface;
  }

  async findOne(token: TokenInterface): Promise<OrganizationInterface> {
    return (await this.dbService.getSingleItem(this.orgCollection, token.oid)) as OrganizationInterface;
  }

  async update(token: TokenInterface, organizationDto: OrganizationDto): Promise<OrganizationInterface> {
    const update = { name: organizationDto.name };
    const result = (await this.dbService.updateSingleItem(
      this.orgCollection,
      token.oid,
      update,
    )) as OrganizationInterface;
    if (result) {
      this.aclService.updateOrgName(result._id, result.name);
      return result;
    }
    throw new InternalServerErrorException('failed to update organization name. Please try again');
  }
}
