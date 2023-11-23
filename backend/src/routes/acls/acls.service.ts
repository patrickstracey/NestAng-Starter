import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { AclDto } from './acl.dto';
import { DatabaseService } from '../../database';
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
  constructor(private dbService: DatabaseService, private mailService: MailService) {}

  private aclCollection = DatabaseTables.ACLS;

  get db() {
    return this.dbService.database.collection(this.aclCollection);
  }

  async create(id_organization: string, createAclDto: AclDto, user?: UserInterface): Promise<AclInterface> {
    const newAcl: BaseAclInterface = {
      id_user: user ? this.dbService.idConvert(user._id) : null,
      id_organization: this.dbService.idConvert(id_organization),
      permission: createAclDto.permission,
      type: TypesEnum.ACL,
      name_organization: createAclDto.name_organization,
      name_user: createAclDto.name_user,
    };

    const result = (await this.dbService.insertSingleItem(this.aclCollection, newAcl)) as AclInterface;
    if (!user) {
      this.mailService.sendInviteEmail(result._id, createAclDto.email);
    }

    return result;
  }

  async findAllByOrg(idOrganization: string): Promise<AclInterface[]> {
    return (await this.dbService.getAllOrgItems(this.aclCollection, idOrganization)) as AclInterface[];
  }

  async findAllByUser(idUser: string | ObjectId): Promise<AclInterface[]> {
    return (await this.dbService.getAllUserItems(this.aclCollection, idUser)) as AclInterface[];
  }

  async update(id: string, updateAclDto: AclDto): Promise<AclInterface> {
    const update = { permission: updateAclDto.permission };
    return (await this.dbService.updateSingleItem(this.aclCollection, id, update)) as AclInterface;
  }

  async delete(id: string): Promise<SuccessMessageInterface> {
    return await this.dbService.deleteSingleItem(this.aclCollection, id);
  }

  async getAclInvite(idAcl: string): Promise<AclInviteInterface> {
    const acl = (await this.dbService.getSingleItem(this.aclCollection, idAcl)) as AclInterface;

    if (acl.id_user == null) {
      const result: AclInviteInterface = {
        _id: acl._id,
        name_organization: acl.name_organization,
      };
      return result;
    }

    throw new NotFoundException('Invite Not Found.');
  }

  async assignUserToAcl(idAcl: string, user: UserInterface): Promise<AclInterface> {
    try {
      const options = { upsert: false, returnDocument: 'after' };
      const update = { id_user: this.dbService.idConvert(user._id), name_user: user.name };
      const result = await this.db.findOneAndUpdate(
        { _id: this.dbService.idConvert(idAcl) },
        { $set: update },
        options,
      );
      if (result._id) {
        return result;
      } else {
        throw new InternalServerErrorException(`Unable to update item. No result returned.`);
      }
    } catch (err) {
      Logger.error(`DB Service: Unable to assign acl with id: [${idAcl}] to user with id [${user._id}]`);
      throw new InternalServerErrorException(`Update of item was not successful. No result returned.`);
    }
  }

  async updateOrgName(orgId: ObjectId, newName: string) {
    try {
      this.db.updateMany({ id_organization: orgId }, { $set: { name_organization: newName } });
    } catch {
      Logger.error(`ACL Service: Failed to rename org ${orgId} on acls dor this org.`);
    }
  }
}
