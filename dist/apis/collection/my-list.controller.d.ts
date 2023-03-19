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
    getMyListDetail(collectionId: number): Promise<{
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
    }[]>;
    getMyListsName(currentUser: any): Promise<import("./entities/collection.entity").Collection[]>;
    getMyListsMe(currentUser: any): Promise<{
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
    getMyListsAll(userId: number): Promise<{
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
    updateMyList(collectionId: number, data: UpdateMyListDto, currentUser: any): Promise<void>;
    deleteMyList(collectionId: number, currentUser: any): Promise<void>;
    myListPlusPosting(postId: number, data: addCollectionPostingDto): Promise<void>;
    myListMinusPosting(postId: number, data: minusCollectionPostingDto, currentUser: any): Promise<void>;
    myListUpdatePosting(postId: number, data: addCollectionPostingDto): Promise<void>;
}
