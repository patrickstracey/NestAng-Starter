import { IsNumber, IsString } from 'class-validator';

export class AclDto {
  @IsNumber()
  permission: number;
  @IsString()
  name_organization: string;
}
