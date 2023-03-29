import { Repository } from 'typeorm';
import { Collection } from './entities/collection.entity';
import { CollectionItem } from './entities/collection-item.entity';
export declare class BookmarkService {
    private collectionRepository;
    private collectionItemRepository;
    constructor(collectionRepository: Repository<Collection>, collectionItemRepository: Repository<CollectionItem>);
    getBookmarks(userId: number): Promise<{
        id: number;
        name: string;
        image: string;
    }[]>;
    getCollections(collectionId: number, userId: number): Promise<{
        id: number;
        images: string;
    }[]>;
    createCollection(userId: number, name: string): Promise<import("typeorm").InsertResult>;
    updateCollection(collectionId: number, name: string): Promise<import("typeorm").UpdateResult>;
    deleteCollection(collectionId: number): Promise<void>;
    basicCollectionPlusPosting(postId: number, userId: number): Promise<CollectionItem>;
    basicCollectionMinusPosting(postId: number, userId: number): Promise<void>;
    collectionPlusPosting(collectionId: number, postId: number): Promise<CollectionItem>;
    collectionMinusPosting(collectionId: number, postId: number): Promise<import("typeorm").DeleteResult>;
    isAllPostsBookmarkedByUser(userId: number, postIds: number[]): Promise<{
        postId: number;
        isBookmarked: string;
    }[]>;
    isOnePostBookmarkedByUser(userId: number, postId: number): Promise<{
        isBookmarked: string;
    }>;
}
