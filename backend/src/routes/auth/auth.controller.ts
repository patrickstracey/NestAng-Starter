import { Body, Controller, Param, Post, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  SessionInterface,
  TokenInterface,
} from '../../../../shared/interfaces';
import { LoginDto } from './auth.dto';
import { Public, TokenData } from '../../utility/decorators';
import { SignupMemberDto } from '../user/user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('/login')
  loginUser(@Body() loginReq: LoginDto): Promise<SessionInterface> {
    return this.authService.loginMember(loginReq);
  }

  @Public()
  @Post('/signup')
  createNewUser(@Body() signupReq: SignupMemberDto){
     this.authService.signupUser(signupReq);
  }

  @Post('/refresh')
  refreshUser(@TokenData() token: TokenInterface): Promise<SessionInterface> {
    return this.authService.refreshToken(token);
  }
}
