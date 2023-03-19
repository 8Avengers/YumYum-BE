import { User } from '../../user/entities/user.entity';
import { Comment } from './comment.entity';
export declare class CommentLike {
    id: number;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;
    user: User;
    comment: Comment;
}
