import { Collection } from './entities/collection.entity';
import { Repository } from 'typeorm/repository/Repository';
import { CollectionItem } from './entities/collection-item.entity';
import { Post } from '../post/entities/post.entity';
export declare class MyListService {
    private collectionRepository;
    private collectionItemRepository;
    private postRepository;
    constructor(collectionRepository: Repository<Collection>, collectionItemRepository: Repository<CollectionItem>, postRepository: Repository<Post>);
    getMyListsDetail(userId: number, collectionId: number): Promise<{
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
    getMyListsDetailPost(userId: number, restaurantId: number, collectionId: number): Promise<CollectionItem[]>;
    getMyListsName(userId: number): Promise<Collection[]>;
    getMyListsMe(userId: number): Promise<{
        collectionItems: CollectionItem[];
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
        collectionItems: CollectionItem[];
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
    createMyList(userId: number, name: string, type: 'myList'): Promise<import("typeorm").InsertResult>;
    updateMyList(userId: number, collectionId: number, name: string, image: string, description: string, visibility: 'public' | 'private'): Promise<void>;
    deleteMyList(userId: number, id: number): Promise<void>;
    myListPlusPosting(postId: number, collectionId: number[]): Promise<void>;
    myListMinusPosting(postId: number, collectionId: number): Promise<void>;
    myListUpdatePosting(postId: number, collectionId: number[]): Promise<void>;
}
