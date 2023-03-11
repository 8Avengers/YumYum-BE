import { IsNumber, IsString, IsArray } from 'class-validator';

export class CreatePostDto {
  @IsString()
  readonly content: string;

  @IsNumber()
  readonly rating: number;

  @IsString()
  readonly img: string;

  readonly visibility: 'public' | 'private';

  @IsArray()
  @IsString({ each: true })
  readonly hashtagNames?: string[];

  @IsArray()
  @IsString({ each: true })
  readonly userNames?: string[];
}
