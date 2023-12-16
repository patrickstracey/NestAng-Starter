import { IsDefined, IsOptional, IsString } from 'class-validator';

export class PodcastDTO{
  @IsString()
  @IsDefined()
  name: string;
  @IsString()
  @IsDefined()
  audioUrl:string;
  @IsString()
  @IsDefined()
  imageUrl:string;
  @IsString()
  @IsOptional()
  _id:string;
}
