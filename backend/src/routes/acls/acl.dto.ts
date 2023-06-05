import { IsEmail, IsNumber, IsString } from 'class-validator';

export class AclDto {
  @IsEmail()
  email: string;
  @IsString()
  name_organization: string;
  @IsString()
  name_user: string;
  @IsNumber()
  permission: number;
}
