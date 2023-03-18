import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { RestaurantService } from './restaurant.service';
export declare class RestaurantController {
    private readonly restaurantService;
    constructor(restaurantService: RestaurantService);
    getRestaurantDetails(kakao_place_id: string): Promise<import("./entities/restaurant.entity").Restaurant[]>;
    createRestaurant(data: CreateRestaurantDto): Promise<any>;
    updateRestaurant(data: UpdateRestaurantDto): Promise<import("typeorm").UpdateResult>;
    deleteRestaurant(kakao_place_id: string): Promise<void>;
}
