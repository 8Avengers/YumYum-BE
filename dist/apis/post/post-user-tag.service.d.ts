import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { Post } from './entities/post.entity';
import { PostUserTag } from './entities/post-usertag.entity';
export declare class PostUserTagService {
    private readonly userRepository;
    private readonly postRepository;
    private readonly postUserTagRepository;
    constructor(userRepository: Repository<User>, postRepository: Repository<Post>, postUserTagRepository: Repository<PostUserTag>);
    tagUsersInPost(postId: number, usernames: string[]): Promise<Post>;
    updateUserTagInPost(postId: number, usernames: string[]): Promise<Post>;
}
