import {
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { DatabaseService } from '../database';

@Injectable()
export class PasswordService {
  constructor(private dbService: DatabaseService) {}

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
}
