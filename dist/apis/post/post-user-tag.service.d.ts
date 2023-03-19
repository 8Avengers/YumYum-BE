import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { Post } from './entities/post.entity';
export declare class PostUserTagService {
    private readonly userRepository;
    private readonly postRepository;
    constructor(userRepository: Repository<User>, postRepository: Repository<Post>);
    tagUsersInPost(postId: number, usernames: string[]): Promise<Post>;
}
