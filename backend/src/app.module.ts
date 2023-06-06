import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard, PermissionGuard } from './utility/guards';
import { UserModule } from './routes/user';
import { AuthModule } from './routes/auth';
import { AclsModule } from './routes/acls';
import { MailModule } from './mail';

@Module({
  imports: [AuthModule, UserModule, AclsModule, MailModule],
  controllers: [],
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: PermissionGuard },
  ],
})
export class AppModule {}
