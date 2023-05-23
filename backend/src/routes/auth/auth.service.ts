import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  UnprocessableEntityException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { SessionInterface, UserInterface } from '../../../../shared/interfaces';
import { EmailOnlyDto, LoginDto, SignupDto } from './auth.dto';
import { JwtService } from '@nestjs/jwt';
import { PermissionEnum } from '../../../../shared/enums';
import { UserService } from '../user';
import { MongoService } from '../../database/mongo';

//import { InvitesService } from "../invites/invites.service";

@Injectable()
export class AuthService {
  constructor(
    private _dbService: MongoService,
    private _user: UserService,
    private JWT_SERVICE: JwtService,
  ) {}

  async attemptLogin(attempt: LoginDto): Promise<SessionInterface> {
    try {
      const user = await this._user.getUserByEmail(attempt.email, true);
      const validPassword = await bcrypt.compare(attempt.password, user?.password);
      if (user && validPassword) {
        return await this.generateJwtSession(this._user.cleanUser(user));
      } else {
        throw new ForbiddenException('Not a valid user or password combination');
      }
    } catch (err) {
      throw new ForbiddenException('Not a valid user or password combination');
    }
  }

  async signupUser(signupAttempt: SignupDto, invite_id?: string): Promise<SessionInterface> {
    const createdUser = await this.generateUser(signupAttempt);
    let startingAcl = undefined;
    try {
      if (invite_id) {
        //startingAcl = await this.attachToInvite(invite_id, createdUser);
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
        await this._user.ensureUniqueEmail(signup.email),
        await this.passwordEncrypt(signup),
      ]);

      if (uniqueEmail && password) {
        return await this._user.insertNewUser(signup, password);
      } else {
        throw new UnprocessableEntityException('Email is not unique. Please try another one!');
      }
    } catch (e) {
      throw new UnprocessableEntityException(e.response);
    }
  }

  private async passwordEncrypt(signupAttempt: {
    password: string;
    passwordConfirm: string;
  }): Promise<string> {
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
    let session: SessionInterface = {
      user: user,
      access_token: null,
      permission: PermissionEnum.USER,
    };
    return session;
  }

  private async buildAccessToken(session: SessionInterface): Promise<string> {
    let payload = {
      uid: session.user._id,
      acc: session.permission,
    };
    return this.JWT_SERVICE.sign(payload);
  }

  async generateResetPasswordEmail(emailDto: EmailOnlyDto): Promise<boolean> {
    try {
      const user = await this._user.getUserByEmail(emailDto.email);
      if (user.email == emailDto.email) {
        //this._invite.generateEmailResetToken(user._id, user.email);
      }
    } catch (e) {
      return true;
    }
    return true;
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
      const result = await this._user.updatePassword(resetInfo.user, newPassword);
      this._invite.deletePasswordReset(reset_id);
      return result;
    }

    throw new UnprocessableEntityException('Not a valid Password Reset Request');
  }*/
}
