import { User } from '../../user/entities/user.entity';
import { Post } from './post.entity';
export declare class PostLike {
    id: number;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;
    user: User;
    post: Post;
}
