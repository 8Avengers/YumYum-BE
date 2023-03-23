import { IsNumber, IsString, IsArray } from 'class-validator';

export class CreatePostDto {
  @IsString({ each: true })
  readonly myListId: string;

  @IsString()
  readonly content: string;

  @IsString()
  readonly rating: string;

  // @IsArray()
  // @IsString({ each: true })
  // readonly image: string[];

  readonly visibility: 'public' | 'private';

  @IsString({ each: true })
  readonly hashtagNames?: string;

  // @IsString({ each: true })
  // // readonly userTags?: string;
}
