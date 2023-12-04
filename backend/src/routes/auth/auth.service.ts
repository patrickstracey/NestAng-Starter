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
  LodgeUserInterface
} from '../../../../shared/interfaces';
import { EmailOnlyDto, LoginDto, SignupDto } from './auth.dto';
import { SignupMemberDto } from '../user/user.dto';
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


  async loginMember(attempt: LoginDto): Promise<SessionInterface>{
    try{
      const member = await this.userService.getMember(attempt.name)
      if (member && (await this.passwordService.checkPassword(attempt.password, member.password))) {
        return await this.generateJwtSession(this.userService.cleanMember(member));
      }else {
        throw new ForbiddenException('Not a valid user or password combination');
      }
    }catch (err) {
      throw new ForbiddenException('Not a valid user or password combination');
    }
  }

  private async generateJwtSession(user: LodgeUserInterface): Promise<SessionInterface> {
    const session: SessionInterface = await this.buildSession(this.userService.cleanMember(user));
    const token: string = await this.buildAccessToken(session);
    return { ...session, access_token: token };
  }

  private async buildSession(user: LodgeUserInterface): Promise<SessionInterface> {
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
    //TODO have to look at this
    const account = await this.userService.getMember("token");
    return this.generateJwtSession(account);
  }

  async signupUser(signupAttempt: SignupMemberDto): Promise<SessionInterface> {
    const createdUser = await this.generateUser(signupAttempt);
    try {
      return await this.generateJwtSession(createdUser);
    } catch (err) {
      throw new InternalServerErrorException(
        'Your user has been created but we failed to log you in successfully. Please reach out to your community administrator.',
      );
    }
  }

  private async generateUser(signup: SignupMemberDto): Promise<LodgeUserInterface> {
    try {
      const [password] = await Promise.all([
        await this.passwordService.encryptPassword(signup),
      ]);

      if (password) {
        return await this.userService.insertNewMember(signup, password);
      } else {
        throw new UnprocessableEntityException('Email is not unique. Please try another one!');
      }
    } catch (e) {
      throw new UnprocessableEntityException(e.response);
    }
  }
}
