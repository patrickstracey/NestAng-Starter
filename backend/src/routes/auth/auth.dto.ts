import { IsDefined, IsEmail, IsOptional, IsString } from 'class-validator';
import { LoginInterface, SignupInterface } from '../../../../shared/interfaces';

export class LoginDto implements LoginInterface {
  @IsString()
  @IsDefined()
  name: string;
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
  @IsString()
  @IsOptional()
  organization_name: string;
}

export class EmailOnlyDto {
  @IsEmail()
  @IsDefined()
  email: string;
}
