import { Module } from '@nestjs/common';
import { RiddleService } from './riddle.service';
import { RiddleController } from './riddle.controller';

import { UserModule } from '../user';
import { DatabaseModule } from '../../database';

@Module({
  imports: [
    DatabaseModule,
    UserModule
  ],

  controllers: [RiddleController],
  providers: [RiddleService],
})
export class RiddleModule {}
