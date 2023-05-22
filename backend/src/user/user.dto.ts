import {IsDefined, IsEmail, IsMongoId, IsOptional, IsPhoneNumber, IsString} from "class-validator";
import {SignupInterface} from "../../../shared/interfaces";

export class UserEditDto {
  @IsMongoId()
  _id: string;
  @IsString()
  @IsOptional()
  name?: string;
  @IsEmail()
  email: string;
  @IsPhoneNumber("US")
  @IsOptional()
  phone?: string;
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