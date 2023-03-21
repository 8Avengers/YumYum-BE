import { MapService } from './map.service';
import { LocationRestaurantDto } from './dto/location-restaurant.dto';
export declare class MapController {
    private readonly mapService;
    constructor(mapService: MapService);
    getFollowerSearchInMap(currentUser: any): Promise<any[]>;
    getFollowerSearchInMapList(currentUser: any): Promise<any[]>;
    getMyPostingSearchInMap(collectionId: number, currentUser: any): Promise<import("../post/entities/post.entity").Post[]>;
    getCloseRestaurant(data: Partial<LocationRestaurantDto>): Promise<any[]>;
}
