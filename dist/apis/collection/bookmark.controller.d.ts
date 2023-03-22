import { BookmarkService } from './bookmark.service';
import { BookmarPostDto } from './dto/bookmark-post.dto';
import { BookmarRastaurantDto } from './dto/bookmark-restaurant.dto';
import { CreateCollectionDto } from './dto/create-bookmark.dto';
export declare class BookmarkController {
    private readonly bookmarkService;
    constructor(bookmarkService: BookmarkService);
    getBookmarks(currentUser: any): Promise<import("./entities/collection.entity").Collection[]>;
    getCollections(collectionId: number): Promise<import("./entities/collection.entity").Collection[]>;
    createCollection(data: CreateCollectionDto, currentUser: any): Promise<import("typeorm").InsertResult>;
    updateCollection(collectionId: number, name: string): Promise<import("typeorm").UpdateResult>;
    deleteCollection(collectionId: number): Promise<void>;
    collectionPlusPosting(postId: number, data: BookmarPostDto): Promise<import("./entities/collection-item.entity").CollectionItem>;
    collectionMinusPosting(postId: number, data: BookmarPostDto): Promise<import("typeorm").DeleteResult>;
    collectionPlusRestaurant(restaurantId: number, data: BookmarRastaurantDto): Promise<import("./entities/collection-item.entity").CollectionItem>;
    collectionMinusRestaurant(restaurantId: number, data: BookmarRastaurantDto): Promise<import("typeorm").DeleteResult>;
}
