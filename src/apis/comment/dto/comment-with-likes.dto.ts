import { Comment } from '../entities/comment.entity';

export class CommentWithLikesDto extends Comment {
  totalLikes: number;
}
