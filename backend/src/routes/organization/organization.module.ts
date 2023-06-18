import { Module } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { OrganizationController } from './organization.controller';
import { DatabaseModule } from '../../database';
import { AclsModule } from '../acls';

@Module({
  imports: [DatabaseModule, AclsModule],
  controllers: [OrganizationController],
  providers: [OrganizationService],
  exports: [OrganizationService],
})
export class OrganizationModule {}
