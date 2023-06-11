import { IsEmail, IsString, IsDefined } from 'class-validator';

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
