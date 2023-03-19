import { Follow } from 'src/apis/user/entities/follow.entity';
import { Post } from 'src/apis/post/entities/post.entity';
import { Repository } from 'typeorm/repository/Repository';
export declare class MapService {
    private postRepository;
    private followRepository;
    constructor(postRepository: Repository<Post>, followRepository: Repository<Follow>);
    getFollowerPosting(userId: number): Promise<any[]>;
    getMyPosting(userId: number, collectionId: number): Promise<Post[]>;
}
