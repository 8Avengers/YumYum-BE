import { IsNumber } from 'class-validator';

export class CreatePostLikeDto {
  @IsNumber()
  userId: number;

  @IsNumber()
  postId: number;
}
