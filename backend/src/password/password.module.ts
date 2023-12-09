import { Module } from '@nestjs/common';
import { PasswordService } from './password.service';
import { DatabaseModule } from '../database';

@Module({
  imports: [DatabaseModule],
  providers: [PasswordService],
  exports: [PasswordService],
})
export class PasswordModule {}
