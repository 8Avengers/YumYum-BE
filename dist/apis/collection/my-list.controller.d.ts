/// <reference types="multer" />
import { minusCollectionPostingDto } from './dto/minus-bookmark-posting.dto';
import { CreateMyListDto } from './dto/create-my-list.dto';
import { UpdateMyListDto } from './dto/update-my-list.dto';
import { MyListService } from './my-list.service';
import { addCollectionPostingDto } from './dto/add-my-list-posting.dto';
import { PostService } from '../post/post.service';
export declare class MyListController {
    private readonly myListService;
    private readonly postService;
    constructor(myListService: MyListService, postService: PostService);
    getMyListDetail(collectionId: number, page: string): Promise<{
        id: number;
        name: string;
        visibility: "public" | "private";
        post: {
            restaurant: import("../restaurant/entities/restaurant.entity").Restaurant;
            images: import("../post/entities/image.entity").Image[];
            id: number;
            content: string;
            rating: number;
            created_at: Date;
            updated_at: Date;
            deleted_at: Date;
            visibility: "public" | "private";
            postLikes: import("../post/entities/post-like.entity").PostLike[];
            comments: import("../comment/entities/comment.entity").Comment[];
            user: import("../user/entities/user.entity").User;
            hashtags: import("../post/entities/hashtag.entity").Hashtag[];
            collectionItems: import("./entities/collection-item.entity").CollectionItem[];
            postUserTags: import("../post/entities/post-usertag.entity").PostUserTag[];
        }[];
    }>;
    getMyListsDetailPost(restaurantId: number, collectionId: number, currentUser: any, page: string): Promise<{
        id: number;
        content: string;
        rating: number;
        updated_at: Date;
        user: import("../user/entities/user.entity").User;
        restaurant: import("../restaurant/entities/restaurant.entity").Restaurant;
        images: import("../post/entities/image.entity").Image[];
        hashtags: string[];
        totalLikes: number;
        isLiked: any;
        totalComments: number;
        myList: import("./entities/collection-item.entity").CollectionItem[];
        visibility: "public" | "private";
    }[]>;
    getMyListsName(currentUser: any): Promise<import("./entities/collection.entity").Collection[]>;
    getMyListsMe(currentUser: any, page: string): Promise<import("./entities/collection.entity").Collection[]>;
    getMyListsAll(userId: number, page: string): Promise<{
        collectionItems: import("./entities/collection-item.entity").CollectionItem[];
        id: number;
        type: string;
        name: string;
        description: string;
        image: string;
        user_id: number;
        visibility: "public" | "private";
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date;
        user: import("../user/entities/user.entity").User;
    }[]>;
    createMyList(data: CreateMyListDto, currentUser: any): Promise<import("typeorm").InsertResult>;
    getMyListInfo(collectionId: number): Promise<import("./entities/collection.entity").Collection>;
    updateMyList(collectionId: number, file: Express.Multer.File, data: UpdateMyListDto, currentUser: any): Promise<{
        name: string;
        image: string;
        description: string;
        visibility: "public" | "private";
    }>;
    deleteMyList(collectionId: number, currentUser: any): Promise<import("typeorm").DeleteResult>;
    myListPlusPosting(postId: number, data: addCollectionPostingDto): Promise<any[]>;
    myListMinusPosting(postId: number, data: minusCollectionPostingDto, currentUser: any): Promise<void>;
    myListUpdatePosting(postId: number, data: addCollectionPostingDto): Promise<void>;
    HotMyList(): Promise<any>;
    FollowersMyList(currentUser: any): Promise<import("./entities/collection-item.entity").CollectionItem[]>;
}
