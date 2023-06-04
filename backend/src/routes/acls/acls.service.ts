import { Injectable } from '@nestjs/common';
import { AclDto } from './acl.dto';
import { MongoService } from '../../database/mongo';
import { DatabaseTables, TypesEnum } from '../../../../shared/enums';
import { AclInterface, BaseAclInterface, SuccessMessageInterface } from '../../../../shared/interfaces';
import { ObjectId } from 'mongodb';

@Injectable()
export class AclsService {
  constructor(private dbService: MongoService) {}

  private aclCollection = DatabaseTables.ACLS;

  get db() {
    return this.dbService.database.collection(this.aclCollection);
  }

  async create(id_organization: string, createAclDto: AclDto): Promise<AclInterface> {
    const newAcl: BaseAclInterface = {
      id_user: null,
      id_organization: this.dbService.bsonConvert(id_organization),
      permission: createAclDto.permission,
      type: TypesEnum.ACL,
      name_organization: createAclDto.name_organization,
    };

    return (await this.dbService.insertSingleItem(this.aclCollection, newAcl)) as AclInterface;
  }

  async findAllByOrg(id_organization: string): Promise<AclInterface[]> {
    return (await this.dbService.getAllOrgItems(this.aclCollection, id_organization)) as AclInterface[];
  }

  async findAllByUser(id_user: string | ObjectId): Promise<AclInterface[]> {
    return (await this.dbService.getAllUserItems(this.aclCollection, id_user)) as AclInterface[];
  }

  async update(id: string, updateAclDto: AclDto): Promise<AclInterface> {
    const update = { permission: updateAclDto.permission };
    return (await this.dbService.updateSingleItem(this.aclCollection, id, update)) as AclInterface;
  }

  async delete(id: string): Promise<SuccessMessageInterface> {
    return await this.dbService.deleteSingleItem(this.aclCollection, id);
  }
}
