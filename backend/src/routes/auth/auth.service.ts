import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  UnprocessableEntityException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AclInviteInterface, SessionInterface, TokenInterface, UserInterface } from '../../../../shared/interfaces';
import { EmailOnlyDto, LoginDto, SignupDto } from './auth.dto';
import { JwtService } from '@nestjs/jwt';
import { PermissionEnum } from '../../../../shared/enums';
import { UserService } from '../user';
import { DatabaseService } from '../../database';
import { AclsService } from '../acls';

@Injectable()
export class AuthService {
  constructor(
    private dbService: DatabaseService,
    private userService: UserService,
    private aclService: AclsService,
    private JWT_SERVICE: JwtService,
  ) {}

  async attemptLogin(attempt: LoginDto): Promise<SessionInterface> {
    try {
      const user = await this.userService.getUserByEmail(attempt.email, true);
      const validPassword = await bcrypt.compare(attempt.password, user?.password);
      if (user && validPassword) {
        return await this.generateJwtSession(this.userService.cleanUser(user));
      } else {
        throw new ForbiddenException('Not a valid user or password combination');
      }
    } catch (err) {
      throw new ForbiddenException('Not a valid user or password combination');
    }
  }

  async signupUser(signupAttempt: SignupDto, invite_id?: string): Promise<SessionInterface> {
    const createdUser = await this.generateUser(signupAttempt);
    try {
      if (invite_id) {
        await this.aclService.assignUserToAcl(invite_id, createdUser);
      }
      return await this.generateJwtSession(createdUser);
    } catch (err) {
      throw new InternalServerErrorException(
        'Your user has been created but we failed to log you in successfully. Please reach out to your community administrator.',
      );
    }
  }

  private async generateUser(signup: SignupDto): Promise<UserInterface> {
    try {
      const [uniqueEmail, password] = await Promise.all([
        await this.userService.ensureUniqueEmail(signup.email),
        await this.passwordEncrypt(signup),
      ]);

      if (uniqueEmail && password) {
        return await this.userService.insertNewUser(signup, password);
      } else {
        throw new UnprocessableEntityException('Email is not unique. Please try another one!');
      }
    } catch (e) {
      throw new UnprocessableEntityException(e.response);
    }
  }

  private async passwordEncrypt(signupAttempt: { password: string; passwordConfirm: string }): Promise<string> {
    if (signupAttempt.password === signupAttempt.passwordConfirm) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(signupAttempt.password, salt);
      return hashedPassword;
    } else {
      throw new UnprocessableEntityException('Passwords do not match');
    }
  }

  private async generateJwtSession(user: UserInterface): Promise<SessionInterface> {
    if (user.password) {
      delete user.password;
    }
    const session: SessionInterface = await this.buildSession(user);
    const token: string = await this.buildAccessToken(session);
    return { ...session, access_token: token };
  }

  private async buildSession(user: UserInterface): Promise<SessionInterface> {
    const acls = await this.aclService.findAllByUser(user._id);
    const starting_acl = acls.length > 0 ? acls[0] : null;
    const session: SessionInterface = {
      user: user,
      access_token: null,
      permission: starting_acl ? starting_acl.permission : PermissionEnum.USER,
      acl_active: starting_acl,
      acl_list: acls,
    };
    return session;
  }

  private async buildAccessToken(session: SessionInterface): Promise<string> {
    const payload = {
      uid: session.user._id,
      oid: session.acl_active.id_organization,
      acc: session.permission,
    };
    return this.JWT_SERVICE.sign(payload);
  }

  async refreshToken(token: TokenInterface): Promise<SessionInterface> {
    const account = await this.userService.getUser(token);
    return this.generateJwtSession(account);
  }

  async generateResetPasswordEmail(emailDto: EmailOnlyDto): Promise<boolean> {
    try {
      const user = await this.userService.getUserByEmail(emailDto.email);
      if (user.email == emailDto.email) {
        //this._invite.generateEmailResetToken(user._id, user.email);
      }
    } catch (e) {
      return true;
    }
    return true;
  }

  getInvite(id: string): Promise<AclInviteInterface> {
    return this.aclService.getAclInvite(id);
  }

  /*async checkValidityOfResetLink(id: string): Promise<boolean> {
                    return !!(await this._invite.getPasswordResetToken(id));
                  }
            
                   async resetUserPassword(reset_id: string, resetReq: PasswordResetDto): Promise<boolean> {
                       const resetInfo = await this._invite.getPasswordResetToken(reset_id);
                    if (resetReq.email == resetInfo?.email) {
                      const newPassword = await this.passwordEncrypt({
                        password: resetReq.password,
                        passwordConfirm: resetReq.passwordConfirm,
                      });
                      const result = await this.userService.updatePassword(resetInfo.user, newPassword);
                      this._invite.deletePasswordReset(reset_id);
                      return result;
                    }
            
                    throw new UnprocessableEntityException('Not a valid Password Reset Request');
                  }*/
}
