import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  UnprocessableEntityException,
} from '@nestjs/common';
import {
  AclInviteInterface,
  OrganizationInterface,
  SessionInterface,
  SuccessMessageInterface,
  TokenInterface,
  UserInterface,
} from '../../../../shared/interfaces';
import { EmailOnlyDto, LoginDto, SignupDto } from './auth.dto';
import { JwtService } from '@nestjs/jwt';
import { PermissionEnum } from '../../../../shared/enums';
import { UserService } from '../user';
import { DatabaseService } from '../../database';
import { AclsService, AclDto } from '../acls';
import { PasswordService, PasswordResetDto } from '../../password';
import { OrganizationService } from '../organization';

@Injectable()
export class AuthService {
  constructor(
    private dbService: DatabaseService,
    private userService: UserService,
    private aclService: AclsService,
    private passwordService: PasswordService,
    private organizationService: OrganizationService,
    private jwtService: JwtService,
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

  async signupUser(signupAttempt: SignupDto, inviteId?: string): Promise<SessionInterface> {
    const createdUser = await this.generateUser(signupAttempt);
    try {
      if (inviteId) {
        //if invited assign new user to correct acl
        await this.aclService.assignUserToAcl(inviteId, createdUser);
      } else if (signupAttempt.organization_name) {
        //if entirely brand new create new org and initial admin ACL for this user
        await this.createNewOrganizationAccount(signupAttempt, createdUser);
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
    const session: SessionInterface = await this.buildSession(this.userService.cleanUser(user));
    const token: string = await this.buildAccessToken(session);
    return { ...session, access_token: token };
  }

  private async buildSession(user: UserInterface): Promise<SessionInterface> {
    const acls = await this.aclService.findAllByUser(user._id);
    const starting_acl = acls.length > 0 ? acls[0] : null;
    const session: SessionInterface = {
      user: user,
      access_token: null,
      acl_active: starting_acl,
      acl_list: acls,
    };
    return session;
  }

  private async buildAccessToken(session: SessionInterface): Promise<string> {
    const payload = {
      uid: session.user._id,
      oid: session.acl_active.id_organization,
      acc: session.acl_active.permission,
    };
    return this.jwtService.sign(payload);
  }

  async refreshToken(token: TokenInterface): Promise<SessionInterface> {
    const account = await this.userService.getUser(token);
    return this.generateJwtSession(account);
  }

  async generateResetPasswordEmail(emailDto: EmailOnlyDto): Promise<SuccessMessageInterface> {
    const result: SuccessMessageInterface = { message: 'success' };
    try {
      const user = await this.userService.getUserByEmail(emailDto.email);
      if (user.email == emailDto.email) {
        await this.passwordService.createAndSendReset(user._id, user.email);
      }
    } catch (e) {
      return result;
    }
    return result;
  }

  getInvite(id: string): Promise<AclInviteInterface> {
    return this.aclService.getAclInvite(id);
  }

  async checkValidityOfResetLink(id: string): Promise<boolean> {
    return !!(await this.passwordService.getResetToken(id));
  }

  async resetUserPassword(resetId: string, resetReq: PasswordResetDto): Promise<boolean> {
    try {
      const resetInfo = await this.passwordService.getResetToken(resetId);
      if (resetReq.email == resetInfo?.email) {
        const newPassword = await this.passwordService.encryptPassword({
          password: resetReq.password,
          passwordConfirm: resetReq.passwordConfirm,
        });
        const result = await this.userService.updatePassword(resetInfo.id_account, newPassword);
        this.passwordService.deletePasswordReset(resetId);
        return result;
      }
    } catch {
      throw new UnprocessableEntityException('Not a valid Password Reset Request');
    }
  }

  async createNewOrganizationAccount(signupAttempt: SignupDto, user: UserInterface) {
    const newOrg: OrganizationInterface = await this.organizationService.create({
      name: signupAttempt.organization_name,
    });

    const aclGenerate: AclDto = {
      email: user.email,
      name_organization: newOrg.name,
      name_user: user.name,
      permission: PermissionEnum.ADMIN,
    };
    await this.aclService.create(newOrg._id, aclGenerate, user);
  }
}
