import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { AclsService } from './acls.service';
import { AclDto } from './acl.dto';
import { Permission, TokenData } from '../../utility/decorators';
import { AclInterface, TokenInterface } from '../../../../shared/interfaces';
import { PermissionEnum } from '../../../../shared/enums';

@Controller('organization/acls')
export class AclsController {
  constructor(private readonly aclsService: AclsService) {}

  @Post()
  @Permission(PermissionEnum.ADMIN)
  create(@TokenData() token: TokenInterface, @Body() createAclDto: AclDto): Promise<AclInterface> {
    return this.aclsService.create(token.oid, createAclDto);
  }

  @Get()
  @Permission(PermissionEnum.ADMIN)
  findAllOrgAcls(@TokenData() token: TokenInterface): Promise<AclInterface[]> {
    if (token.oid) {
      return this.aclsService.findAllByOrg(token.oid);
    }
    throw new BadRequestException('You are not part of an organization');
  }

  @Patch('/:id')
  @Permission(PermissionEnum.ADMIN)
  update(@Param('id') id: string, @Body() updateAclDto: AclDto) {
    return this.aclsService.update(id, updateAclDto);
  }

  @Delete('/:id')
  @Permission(PermissionEnum.ADMIN)
  remove(@Param('id') id: string) {
    return this.aclsService.delete(id);
  }
}
