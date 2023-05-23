import { IsDefined, IsEmail, IsString } from 'class-validator';
import { LoginInterface, SignupInterface } from '../../../../shared/interfaces';

export class LoginDto implements LoginInterface {
  @IsEmail()
  @IsDefined()
  email: string;
  @IsString()
  @IsDefined()
  password: string;
}

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

export class EmailOnlyDto {
  @IsEmail()
  @IsDefined()
  email: string;
}

export class PasswordResetDto {
  @IsEmail()
  @IsDefined()
  email: string;
  @IsString()
  @IsDefined()
  password: string;
  @IsString()
  @IsDefined()
  passwordConfirm: string;
}
