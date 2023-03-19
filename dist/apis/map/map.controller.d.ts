import { MapService } from './map.service';
export declare class MapController {
    private readonly mapService;
    constructor(mapService: MapService);
    getFollowerSearchInMap(currentUser: any): Promise<any[]>;
    getMyPostingSearchInMap(collectionId: number, currentUser: any): Promise<import("../post/entities/post.entity").Post[]>;
}
