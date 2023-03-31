import { SearchService } from './search.service';
export declare class SearchController {
    private readonly searchService;
    constructor(searchService: SearchService);
    getUserSearch(keyword: string, page: string): Promise<import("../user/entities/user.entity").User[]>;
    getRestaurantSearch(keyword: string, page: string): Promise<import("../restaurant/entities/restaurant.entity").Restaurant[]>;
    getHashtagSearch(keyword: string, page: string): Promise<import("../post/entities/hashtag.entity").Hashtag[]>;
    getPostSearchByHashtag(hashtag: string, page: string): Promise<import("../post/entities/post.entity").Post[]>;
}
