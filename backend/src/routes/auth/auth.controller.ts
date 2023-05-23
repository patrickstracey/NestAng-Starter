import { Body, Controller, Param, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SessionInterface, TokenInterface } from '../../../../shared/interfaces';
import { EmailOnlyDto, LoginDto, SignupDto } from './auth.dto';
import { Public, TokenData } from '../../utility/decorators';

//import { InvitesService } from "../invites/invites.service";

@Controller('auth')
export class AuthController {
  constructor(private readonly _auth: AuthService) {}

  @Public()
  @Post('/login')
  loginUser(@Body() loginReq: LoginDto): Promise<SessionInterface> {
    return this._auth.attemptLogin(loginReq);
  }

  //TO DO: Hookup Invites
  /*  @Public()
  @Get("/signup/:id")
  checkForInvite(@Param("id") id: string): Promise<InviteInterface> {
    return this._invite.getInvite(id);
  }*/

  @Public()
  @Post('/signup/:id')
  createNewAttachedResidentUser(
    @Param('id') invite_id: string,
    @Body() signupReq: SignupDto,
  ): Promise<SessionInterface> {
    return this._auth.signupUser(signupReq, invite_id);
  }

  @Public()
  @Post('/signup')
  createNewUser(@Body() signupReq: SignupDto): Promise<SessionInterface> {
    return this._auth.signupUser(signupReq);
  }

  @Public()
  @Post('/request-reset')
  resetPasswordRequest(@Body() signupReq: EmailOnlyDto): Promise<boolean> {
    return this._auth.generateResetPasswordEmail(signupReq);
  }

  /*  @Public()
  @Get('/password-reset/:id')
  getResetValidity(@Param('id') reset_id: string): Promise<boolean> {
    return this._auth.checkValidityOfResetLink(reset_id);
  }

  @Public()
  @Post('/password-reset/:id')
  ResetPassword(
    @Param('id') reset_id: string,
    @Body() signupReq: PasswordResetDto,
  ): Promise<boolean> {
    return this._auth.resetUserPassword(reset_id, signupReq);
  }*/

  @Post('/refresh')
  refreshUser(@TokenData() token: TokenInterface): Promise<SessionInterface> {
    return this._auth.refreshToken(token);
  }
}
