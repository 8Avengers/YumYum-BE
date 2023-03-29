import { BookmarkService } from './bookmark.service';
import { CreateCollectionDto } from './dto/create-bookmark.dto';
export declare class BookmarkController {
    private readonly bookmarkService;
    constructor(bookmarkService: BookmarkService);
    getBookmarks(currentUser: any): Promise<{
        id: number;
        name: string;
        image: string;
    }[]>;
    createCollection(data: CreateCollectionDto, currentUser: any): Promise<import("typeorm").InsertResult>;
    updateCollection(collectionId: number, name: string): Promise<import("typeorm").UpdateResult>;
    deleteCollection(collectionId: number): Promise<void>;
    getCollections(collectionId: number, currentUser: any): Promise<{
        id: number;
        images: string;
    }[]>;
    basicCollectionMinusPosting(postId: number, currentUser: any): Promise<void>;
    basicCollectionPlusPosting(postId: number, currentUser: any): Promise<import("./entities/collection-item.entity").CollectionItem>;
    collectionMinusPosting(collectionId: number, postId: number): Promise<import("typeorm").DeleteResult>;
    collectionPlusPosting(collectionId: number, postId: number): Promise<import("./entities/collection-item.entity").CollectionItem>;
}
