import { IsNumber } from 'class-validator';

export class CreateCommentLikeDto {
  @IsNumber()
  readonly userId: number;

  @IsNumber()
  commentId: number;
}
