import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { TokenInterface, LodgeUserInterface} from '../../../../shared/interfaces';
import { UserEditDto, SignupMemberDto } from './user.dto';
import { DatabaseTables, TypesEnum, UserTypesEnum } from '../../../../shared/enums';
import { DatabaseService } from '../../database';
import { MailService } from '../../mail';

@Injectable()
export class UserService {
  constructor(private dbService: DatabaseService, private mailService: MailService) {}

  private usersCollection = DatabaseTables.USERS;

  get db() {
    return this.dbService.database.collection(this.usersCollection);
  }

  async getAllMembers():Promise<LodgeUserInterface[]>{
      const allUsers = (await this.db.find().toArray())
       allUsers.array.forEach(element => {
        this.cleanMember(element)//Needs to be done otherwise we would return pws here
       });
      return allUsers;
  }

  async getMember(userName: string, withPassword = false):Promise<LodgeUserInterface>{
    try{
      const member = (await this.db.findOne({ userName: userName })) as LodgeUserInterface;
      if (withPassword) {
        return member;
      } else {
        return this.cleanMember(member)
      }
    }catch (err){
      throw new NotFoundException('');
    }
  }

  async updateMember(token: TokenInterface, updates: UserEditDto): Promise<LodgeUserInterface> {
    const id = updates.name;
    const user = (await this.db.findOne({ userName: id })) as LodgeUserInterface;
    if (id == token.uid) {
      const newMember: LodgeUserInterface = {
        userName: user.userName,
        logedIn: updates.logedIn,
        finalGuess:updates.finalGuess,
        stations: updates.stations,
        password: user.password,
        userType: user.userType,
        type: TypesEnum.USER,
        _id: user._id

      };
      const result = (await this.dbService.updateSingleItem(
        this.usersCollection,
        id,
        newMember,
      )) as LodgeUserInterface;

      return this.cleanMember(result)
    } else {
      throw new ForbiddenException('You cannot update this user account.');
    }
  }

  async insertNewMember(signupAttempt: SignupMemberDto, encryptedPassword: string): Promise<LodgeUserInterface> {
    try {
      const newMember: LodgeUserInterface = {
        userName: signupAttempt.name,
        password:encryptedPassword,
        logedIn:false,
        finalGuess:"",
        stations: new Array<string>(8),
        userType: signupAttempt.type,
        type: TypesEnum.USER,
        _id: signupAttempt.name
      };
      const insertResult = await this.db.insertOne(newMember);
      return this.cleanMember(newMember);
    } catch (err) {
      throw new InternalServerErrorException('Unable to insert new user.');
    }
  }

  cleanMember(account: LodgeUserInterface): LodgeUserInterface {
    const { password, ...clean } = account;
    return clean;
  }
}
