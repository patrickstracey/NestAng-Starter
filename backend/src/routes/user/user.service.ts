import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { BaseUserInterface, TokenInterface, UserInterface } from '../../../../shared/interfaces';
import { SignupDto, UserEditDto } from './user.dto';
import { DatabaseTables, TypesEnum } from '../../../../shared/enums';
import { MongoService } from '../../database/mongo';
import { MailService } from '../../mail';

@Injectable()
export class UserService {
  constructor(private dbService: MongoService, private mailService: MailService) {}

  private usersCollection = DatabaseTables.USERS;

  get db() {
    return this.dbService.database.collection(this.usersCollection);
  }

  async getUser(token: TokenInterface): Promise<UserInterface> {
    try {
      const account = (await this.db.findOne({
        _id: this.dbService.bsonConvert(token.uid),
      })) as UserInterface;
      return this.cleanUser(account);
    } catch (err) {
      throw new NotFoundException('');
    }
  }

  async getUserByEmail(email: string, withPassword = false): Promise<UserInterface> {
    try {
      const account = (await this.db.findOne({ email: email })) as UserInterface;
      if (withPassword) {
        //return object includes password, careful!
        return account;
      } else {
        return this.cleanUser(account);
      }
    } catch (err) {
      throw new NotFoundException('');
    }
  }

  async updateUser(token: TokenInterface, updates: UserEditDto): Promise<UserInterface> {
    const id = updates._id;
    if (id == token.uid) {
      delete updates['_id'];
      const updatedUserAttempt = { type: TypesEnum.USER, ...updates };
      const result = (await this.dbService.updateSingleItem(
        this.usersCollection,
        id,
        updatedUserAttempt,
      )) as UserInterface;

      return this.cleanUser(result);
    } else {
      throw new ForbiddenException('You cannot update this user account.');
    }
  }

  async insertNewUser(signupAttempt: SignupDto, encryptedPassword: string): Promise<UserInterface> {
    try {
      const newUser: BaseUserInterface = {
        email: signupAttempt.email,
        password: encryptedPassword,
        type: TypesEnum.USER,
        phone: null,
        name: signupAttempt.name,
        date_created: new Date(),
      };
      const insertResult = await this.db.insertOne(newUser);
      const returnedUser: UserInterface = {
        _id: insertResult['insertedId'],
        ...newUser,
      };
      this.mailService.sendCreationWelcomeEmail(newUser.email);
      return this.cleanUser(returnedUser);
    } catch (err) {
      throw new InternalServerErrorException('Unable to insert new user.');
    }
  }

  async ensureUniqueEmail(emailCheck: string): Promise<boolean> {
    try {
      const result = await this.db.findOne({ email: emailCheck });
      return !result;
    } catch (err) {
      Logger.error(`Failed to lookup user by email on unique check: [${emailCheck}]`);
      throw new NotFoundException();
    }
  }

  async updatePassword(account_id: string, newPassword: string): Promise<boolean> {
    try {
      const update = { password: newPassword };
      const options = { upsert: false, returnDocument: 'after' };
      const result = await this.db.findOneAndUpdate(
        { _id: this.dbService.bsonConvert(account_id) },
        { $set: update },
        options,
      );
      return !!result;
    } catch (e) {
      throw new InternalServerErrorException('Something went wrong during password update.');
    }
  }

  cleanUser(account: UserInterface): UserInterface {
    const { password, ...clean } = account;
    return clean;
  }
}
