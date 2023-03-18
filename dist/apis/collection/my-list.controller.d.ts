import { minusCollectionPostingDto } from './dto/minus-bookmark-posting.dto';
import { CreateMyListDto } from './dto/create-my-list.dto';
import { UpdateMyListDto } from './dto/update-my-list.dto';
import { MyListService } from './my-list.service';
import { addCollectionPostingDto } from './dto/add-my-list-posting.dto';
import { DetailMylistDto } from './dto/my-list.detail.dto';
export declare class MyListController {
    private readonly myListService;
    constructor(myListService: MyListService);
    getMyListsDetail(collectionId: number, currentUser: any): Promise<{
        name: string;
        description: string;
        image: string;
        collectionItems: {
            id: number;
            post: {
                id: number;
                rating: number;
            };
            restaurant: {
                id: number;
                place_name: string;
            };
        }[];
    }[]>;
    getMyListsDetailPost(restaurantId: number, data: DetailMylistDto, currentUser: any): Promise<import("./entities/collection-item.entity").CollectionItem[]>;
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
