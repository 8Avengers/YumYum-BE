import { IsNumber, IsString } from 'class-validator';

export class CreatePostDto {
  @IsString()
  readonly content: string;

  @IsNumber()
  readonly rating: number;

  @IsString()
  readonly img: string;
}
