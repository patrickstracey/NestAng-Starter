import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { environment } from '../../../environments/environment';
import { JwtStrategy } from './jwt.strategy';
import { UserModule } from '../user';
import { DatabaseModule } from '../../database';
import { AclsModule } from '../acls';
import { PasswordModule } from '../../password';

@Module({
  imports: [
    DatabaseModule,
    UserModule,
    AclsModule,
    PasswordModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: environment.jwt_secret,
      signOptions: { expiresIn: environment.session_length },
    }),
  ],

  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
