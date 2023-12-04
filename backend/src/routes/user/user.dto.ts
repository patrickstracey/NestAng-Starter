import {
  IsDefined,
  IsEmail,
  IsMongoId,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { SignupInterface } from '../../../../shared/interfaces';
import { UserTypesEnum } from '../../../../shared/enums';

export class SignupMemberDto{
  @IsString()
  @IsDefined()
  name: string;
  @IsString()
  @IsDefined()
  password: string;
  @IsString()
  @IsDefined()
  passwordConfirm: string;
  @IsDefined()
  type: UserTypesEnum;
}

export class UserEditDto {
  @IsString()
  @IsDefined()
  name: string;
  @IsDefined()
  stations:Array<string>;
  @IsString()
  @IsDefined()
  finalGuess:string;
  @IsDefined()
  logedIn:boolean; 
}

//old code, needs refactor
export class SignupDto implements SignupInterface {
  @IsEmail()
  @IsDefined()
  email: string;
  @IsString()
  @IsDefined()
  name: string;
  @IsString()
  @IsDefined()
  password: string;
  @IsString()
  @IsDefined()
  passwordConfirm: string;
}
