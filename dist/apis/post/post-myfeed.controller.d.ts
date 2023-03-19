import { PostService } from './post.service';
export declare class MyFeedController {
    private readonly postService;
    constructor(postService: PostService);
    getMyFeed(currentUser: any): Promise<{
        id: number;
        content: string;
        rating: number;
        updated_at: Date;
        user: import("../user/entities/user.entity").User;
        restaurant: import("../restaurant/entities/restaurant.entity").Restaurant;
        images: import("./entities/image.entity").Image[];
        hashtags: string[];
        totalLikes: number;
        isLiked: any;
        totalComments: number;
        myList: import("../collection/entities/collection-item.entity").CollectionItem[];
        visibility: "public" | "private";
    }[]>;
}
