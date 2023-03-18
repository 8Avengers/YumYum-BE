import { Post } from '../../post/entities/post.entity';
import { User } from '../../user/entities/user.entity';
import { CommentLike } from './comment-like.entity';
import { CommentUserTag } from './comment-usertag.entity';
export declare class Comment {
    id: number;
    content: string;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;
    user: User;
    post: Post;
    commentUserTags: CommentUserTag[];
    commentLikes: CommentLike[];
}
