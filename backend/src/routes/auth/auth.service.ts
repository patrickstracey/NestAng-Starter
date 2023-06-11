import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { AclInviteInterface, SessionInterface, TokenInterface, UserInterface } from '../../../../shared/interfaces';
import { EmailOnlyDto, LoginDto, SignupDto } from './auth.dto';
import { JwtService } from '@nestjs/jwt';
import { PermissionEnum } from '../../../../shared/enums';
import { UserService } from '../user';
import { DatabaseService } from '../../database';
import { AclsService } from '../acls';
import { PasswordService, PasswordResetDto } from '../../password';

@Injectable()
export class AuthService {
  constructor(
    private dbService: DatabaseService,
    private userService: UserService,
    private aclService: AclsService,
    private passwordService: PasswordService,
    private JWT_SERVICE: JwtService,
  ) {}

  async attemptLogin(attempt: LoginDto): Promise<SessionInterface> {
    try {
      const user = await this.userService.getUserByEmail(attempt.email, true);

      if (user && (await this.passwordService.checkPassword(attempt.password, user.password))) {
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
        await this.passwordService.encryptPassword(signup),
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
        await this.passwordService.createAndSendReset(user._id, user.email);
      }
    } catch (e) {
      return true;
    }
    return true;
  }

  getInvite(id: string): Promise<AclInviteInterface> {
    return this.aclService.getAclInvite(id);
  }

  async checkValidityOfResetLink(id: string): Promise<boolean> {
    return !!(await this.passwordService.getResetToken(id));
  }

  async resetUserPassword(reset_id: string, resetReq: PasswordResetDto): Promise<boolean> {
    try {
      const resetInfo = await this.passwordService.getResetToken(reset_id);
      if (resetReq.email == resetInfo?.email) {
        const newPassword = await this.passwordService.encryptPassword({
          password: resetReq.password,
          passwordConfirm: resetReq.passwordConfirm,
        });
        const result = await this.userService.updatePassword(resetInfo.id_account, newPassword);
        this.passwordService.deletePasswordReset(reset_id);
        return result;
      }
    } catch {
      throw new UnprocessableEntityException('Not a valid Password Reset Request');
    }
  }
}
