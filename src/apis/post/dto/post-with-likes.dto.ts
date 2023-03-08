import { Post } from '../entities/post.entity';

export class PostWithLikesDto extends Post {
  totalLikes: number;
}
