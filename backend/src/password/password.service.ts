import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PasswordResetInterface } from '../../../shared/interfaces';
import { DatabaseTables, TypesEnum } from '../../../shared/enums';
import { DatabaseService } from '../database';
import { MailService } from '../mail';

@Injectable()
export class PasswordService {
  constructor(private dbService: DatabaseService, private mailService: MailService) {}

  private resetsCollection = DatabaseTables.RESETS;

  async checkPassword(attempt, existing): Promise<boolean> {
    return await bcrypt.compare(attempt, existing);
  }

  async encryptPassword(signupAttempt: { password: string; passwordConfirm: string }): Promise<string> {
    if (signupAttempt.password === signupAttempt.passwordConfirm) {
      const salt = await bcrypt.genSalt(10);
      return await bcrypt.hash(signupAttempt.password, salt);
    } else {
      throw new UnprocessableEntityException('Passwords do not match');
    }
  }

  async createAndSendReset(account_id: string, email: string): Promise<boolean> {
    const today = new Date();
    const expires = new Date();
    expires.setMinutes(today.getMinutes() + 25);

    const resetToken: PasswordResetInterface = {
      type: TypesEnum.PASSWORD_RESET,
      id_account: this.dbService.idConvert(account_id),
      email: email,
      created: today,
      expires: expires,
    };

    const result = await this.dbService.insertSingleItem(this.resetsCollection, resetToken);
    if (result._id) {
      this.mailService.sendPasswordResetEmail(email, result._id);
      return true;
    }
    throw new InternalServerErrorException('Could not generate a password reset');
  }

  async getResetToken(reset_id: string): Promise<PasswordResetInterface> {
    const result = (await this.dbService.getSingleItem(this.resetsCollection, reset_id)) as PasswordResetInterface;
    if (new Date() < result?.expires) {
      return result;
    } else {
      this.deletePasswordReset(reset_id);
      throw new NotFoundException('Not a valid password reset link');
    }
  }

  deletePasswordReset(reset_id) {
    this.dbService.deleteSingleItem(this.resetsCollection, reset_id);
  }
}
