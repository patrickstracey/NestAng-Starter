import { Module } from '@nestjs/common';
import { AclsService } from './acls.service';
import { AclsController } from './acls.controller';
import { MongoModule } from '../../database/mongo';
import { MailModule } from '../../mail';

@Module({
  imports: [MongoModule, MailModule],
  controllers: [AclsController],
  providers: [AclsService],
  exports: [AclsService],
})
export class AclsModule {}
