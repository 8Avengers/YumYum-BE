import { IsNumber, IsString, IsArray } from 'class-validator';

export class CreatePostDto {
  @IsArray()
  @IsNumber({}, { each: true })
  readonly myListId: number[];

  @IsString()
  readonly content: string;

  @IsNumber()
  readonly rating: number;

  @IsArray()
  @IsString({ each: true })
  readonly image: string;

  readonly visibility: 'public' | 'private';

  @IsArray()
  @IsString({ each: true })
  readonly hashtagNames?: string[];

  // @IsArray()
  // @IsString({ each: true })
  // readonly userNames?: string[];
}
