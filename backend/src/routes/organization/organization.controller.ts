import { Controller, Get, Body, Patch } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { OrganizationDto } from './organization.dto';
import { Permission, TokenData } from '../../utility/decorators';
import { PermissionEnum } from '../../../../shared/enums';
import { OrganizationInterface, TokenInterface } from '../../../../shared/interfaces';

@Controller('organization')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Get()
  findOne(@TokenData() token: TokenInterface): Promise<OrganizationInterface> {
    return this.organizationService.findOne(token);
  }

  @Patch()
  @Permission(PermissionEnum.ADMIN)
  update(@TokenData() token: TokenInterface, @Body() organizationDto: OrganizationDto): Promise<OrganizationInterface> {
    return this.organizationService.update(token, organizationDto);
  }
}
