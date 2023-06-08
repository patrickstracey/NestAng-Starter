import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { AclDto } from './acl.dto';
import { MongoService } from '../../database/mongo';
import { DatabaseTables, TypesEnum } from '../../../../shared/enums';
import {
  AclInterface,
  AclInviteInterface,
  BaseAclInterface,
  SuccessMessageInterface,
  UserInterface,
} from '../../../../shared/interfaces';
import { ObjectId } from 'mongodb';
import { MailService } from '../../mail';

@Injectable()
export class AclsService {
  constructor(private dbService: MongoService, private mailService: MailService) {}

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
      name_user: createAclDto.name_user,
    };

    const result = (await this.dbService.insertSingleItem(this.aclCollection, newAcl)) as AclInterface;
    this.mailService.sendInviteEmail(result._id, createAclDto.email);
    return result;
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

  async getAclInvite(id_acl: string): Promise<AclInviteInterface> {
    const acl = (await this.dbService.getSingleItem(this.aclCollection, id_acl)) as AclInterface;

    if (acl.id_user == null) {
      const result: AclInviteInterface = {
        _id: acl._id,
        name_organization: acl.name_organization,
      };
      return result;
    }

    throw new NotFoundException('Invite Not Found.');
  }

  async assignUserToAcl(id_acl: string, user: UserInterface) {
    try {
      const options = { upsert: false, returnDocument: 'after' };
      const update = { id_user: this.dbService.bsonConvert(user._id), name_user: user.name };
      const result = await this.db.findOneAndUpdate(
        { _id: this.dbService.bsonConvert(id_acl) },
        { $set: update },
        options,
      );
      if (result.value._id) {
        return result.value;
      } else {
        new InternalServerErrorException(`Unable to update item. No result returned.`);
      }
    } catch (err) {
      Logger.error(`DB Service: Unable to assign acl with id: [${id_acl}] to user with id [${user._id}]`);
      throw new InternalServerErrorException(`Update of item was not successful`);
    }
  }
}
