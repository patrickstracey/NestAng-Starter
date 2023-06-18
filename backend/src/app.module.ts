import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard, PermissionGuard } from './utility/guards';
import { DatabaseModule } from './database';
import { UserModule } from './routes/user';
import { AuthModule } from './routes/auth';
import { AclsModule } from './routes/acls';
import { UploadsModule } from './routes/uploads';

@Module({
  imports: [DatabaseModule, AuthModule, UserModule, AclsModule, UploadsModule],
  controllers: [],
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: PermissionGuard },
  ],
})
export class AppModule {}
