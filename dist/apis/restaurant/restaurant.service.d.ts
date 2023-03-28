import { Repository } from 'typeorm/repository/Repository';
import { Restaurant } from './entities/restaurant.entity';
import { Post } from '../post/entities/post.entity';
export declare class RestaurantService {
    private restaurantRepository;
    private postRepository;
    constructor(restaurantRepository: Repository<Restaurant>, postRepository: Repository<Post>);
    getRestaurantDetails(kakao_place_id: string): Promise<Restaurant>;
    createRestaurant(address_name: string, category_group_code: string, category_group_name: string, category_name: string, kakao_place_id: string, phone: string, place_name: string, road_address_name: string, x: string, y: string): Promise<any>;
    updateRestaurant(address_name: string, category_group_code: string, category_group_name: string, category_name: string, kakao_place_id: string, phone: string, place_name: string, road_address_name: string, x: string, y: string): Promise<import("typeorm").UpdateResult>;
    catch(err: any): void;
    deleteRestaurant(kakao_place_id: any): Promise<void>;
    getNearRestaurant(x: string, y: string): Promise<any[]>;
    getRelatedRestaurant(kakao_place_id: string, page: string): Promise<Post[]>;
}
