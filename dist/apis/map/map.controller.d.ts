import { MapService } from './map.service';
export declare class MapController {
    private readonly mapService;
    constructor(mapService: MapService);
    getFollowerSearchInMap(type: string, currentUser: any): Promise<any[]>;
    getFollowerSearchInMapList(currentUser: any): Promise<any[]>;
    getMyPostingSearchInMap(collectionId: number, currentUser: any): Promise<import("../post/entities/post.entity").Post[]>;
    getUserPostingSearchInMap(userId: number): Promise<import("../post/entities/post.entity").Post[]>;
}
