import { Module } from '@nestjs/common';
import { PasswordService } from './password.service';
import { DatabaseModule } from '../database';
import { MailModule } from '../mail';

@Module({
  imports: [DatabaseModule, MailModule],
  providers: [PasswordService],
  exports: [PasswordService],
})
export class PasswordModule {}
