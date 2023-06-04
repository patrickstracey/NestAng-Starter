import { IsNumber } from 'class-validator';

export class AclDto {
  @IsNumber()
  permission: number;
}
