import { IsString } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  readonly content: string;
}
