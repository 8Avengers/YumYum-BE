import { Hashtag } from './../post/entities/hashtag.entity';
import { Restaurant } from './../restaurant/entities/restaurant.entity';
import { User } from './../user/entities/user.entity';
import { Repository } from 'typeorm/repository/Repository';
export declare class SearchService {
    private userRepository;
    private restaurantRepository;
    private hashtagRepository;
    constructor(userRepository: Repository<User>, restaurantRepository: Repository<Restaurant>, hashtagRepository: Repository<Hashtag>);
    getUserSearch(keyword: string): Promise<User[]>;
    getRestaurantSearch(keyword: string): Promise<Restaurant[]>;
    getHashtagSearch(keyword: string): Promise<Hashtag[]>;
    getPostSearchByHashtag(hashtag: string): Promise<Hashtag[]>;
}
