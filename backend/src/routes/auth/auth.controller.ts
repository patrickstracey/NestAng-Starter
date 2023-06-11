import { Body, Controller, Param, Post, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AclInviteInterface, SessionInterface, TokenInterface } from '../../../../shared/interfaces';
import { EmailOnlyDto, LoginDto, SignupDto } from './auth.dto';
import { PasswordResetDto } from '../../password';
import { Public, TokenData } from '../../utility/decorators';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('/login')
  loginUser(@Body() loginReq: LoginDto): Promise<SessionInterface> {
    return this.authService.attemptLogin(loginReq);
  }

  @Public()
  @Get('/signup/:id')
  checkForInvite(@Param('id') id: string): Promise<AclInviteInterface> {
    return this.authService.getInvite(id);
  }

  @Public()
  @Post('/signup/:id')
  createNewAttachedResidentUser(
    @Param('id') invite_id: string,
    @Body() signupReq: SignupDto,
  ): Promise<SessionInterface> {
    return this.authService.signupUser(signupReq, invite_id);
  }

  @Public()
  @Post('/signup')
  createNewUser(@Body() signupReq: SignupDto): Promise<SessionInterface> {
    return this.authService.signupUser(signupReq);
  }

  @Public()
  @Post('/request-reset')
  resetPasswordRequest(@Body() signupReq: EmailOnlyDto): Promise<boolean> {
    return this.authService.generateResetPasswordEmail(signupReq);
  }

  @Public()
  @Get('/password-reset/:id')
  getResetValidity(@Param('id') reset_id: string): Promise<boolean> {
    return this.authService.checkValidityOfResetLink(reset_id);
  }

  @Public()
  @Post('/password-reset/:id')
  ResetPassword(@Param('id') reset_id: string, @Body() signupReq: PasswordResetDto): Promise<boolean> {
    return this.authService.resetUserPassword(reset_id, signupReq);
  }

  @Post('/refresh')
  refreshUser(@TokenData() token: TokenInterface): Promise<SessionInterface> {
    return this.authService.refreshToken(token);
  }
}
