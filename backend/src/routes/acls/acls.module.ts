import { Module } from '@nestjs/common';
import { AclsService } from './acls.service';
import { AclsController } from './acls.controller';
import { MongoModule } from '../../database/mongo';

@Module({
  imports: [MongoModule],
  controllers: [AclsController],
  providers: [AclsService],
})
export class AclsModule {}
