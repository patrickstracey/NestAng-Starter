import { IsString } from "class-validator";

export class GetDocUrlDto {
  @IsString()
  fileName: string;
}
