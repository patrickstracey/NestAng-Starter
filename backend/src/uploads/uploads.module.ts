import { Module } from '@nestjs/common';
import { UploadsService } from './uploads.service';
import { UploadsController } from './uploads.controller';
import { DatabaseModule } from '../database';

@Module({
  providers: [UploadsService],
  imports: [DatabaseModule],
  exports: [UploadsService],
  controllers: [UploadsController],
})
export class UploadsModule {}
