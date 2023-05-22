import { Module } from '@nestjs/common';
import { UserModule } from './user';

@Module({
  imports: [UserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
