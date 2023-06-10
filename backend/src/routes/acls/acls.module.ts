import { Module } from '@nestjs/common';
import { AclsService } from './acls.service';
import { AclsController } from './acls.controller';
import { DatabaseModule } from '../../database';
import { MailModule } from '../../mail';

@Module({
  imports: [DatabaseModule, MailModule],
  controllers: [AclsController],
  providers: [AclsService],
  exports: [AclsService],
})
export class AclsModule {}
