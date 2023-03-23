import { Restaurant } from './../restaurant/entities/restaurant.entity';
import { Follow } from 'src/apis/user/entities/follow.entity';
import { Post } from 'src/apis/post/entities/post.entity';
import { Repository } from 'typeorm/repository/Repository';
export declare class MapService {
    private postRepository;
    private followRepository;
    private restaurantRepository;
    constructor(postRepository: Repository<Post>, followRepository: Repository<Follow>, restaurantRepository: Repository<Restaurant>);
    getFollowerPosting(userId: number): Promise<any[]>;
    getFollowerPostingList(userId: number): Promise<any[]>;
    getMyCollectionPosting(userId: number, collectionId: number): Promise<Post[]>;
    getUserPosting(userId: number): Promise<Post[]>;
}
