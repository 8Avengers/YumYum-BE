/// <reference types="multer" />
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { PostLikeService } from './post-like.service';
import { PostHashtagService } from './post-hashtag.service';
import { MyListService } from '../collection/my-list.service';
import { Comment } from '../comment/entities/comment.entity';
import { RestaurantService } from '../restaurant/restaurant.service';
import { ImageRepository } from './image.repository';
import { UploadService } from '../upload/upload.service';
import { CollectionItem } from '../collection/entities/collection-item.entity';
import { PostLike } from './entities/post-like.entity';
import { Restaurant } from '../restaurant/entities/restaurant.entity';
export declare class PostService {
    private postRepository;
    private commentRepository;
    private collectionItemRepository;
    private postLikeRepository;
    private imageRepository;
    private readonly likeService;
    private readonly postHashtagService;
    private readonly myListService;
    private readonly restaurantService;
    private readonly uploadService;
    constructor(postRepository: Repository<Post>, commentRepository: Repository<Comment>, collectionItemRepository: Repository<CollectionItem>, postLikeRepository: Repository<PostLike>, imageRepository: ImageRepository, likeService: PostLikeService, postHashtagService: PostHashtagService, myListService: MyListService, restaurantService: RestaurantService, uploadService: UploadService);
    getPosts(userId: number): Promise<{
        id: number;
        content: string;
        rating: number;
        updated_at: Date;
        user: import("../user/entities/user.entity").User;
        restaurant: Restaurant;
        images: import("./entities/image.entity").Image[];
        hashtags: string[];
        totalLikes: number;
        isLiked: any;
        totalComments: number;
        myList: CollectionItem[];
        visibility: "public" | "private";
    }[]>;
    getPostById(postId: number, userId: number): Promise<{
        id: number;
        content: string;
        rating: number;
        updated_at: Date;
        user: import("../user/entities/user.entity").User;
        restaurant: Restaurant;
        images: import("./entities/image.entity").Image[];
        totalLikes: number;
        hashtags: {
            name: string;
        }[];
        isLiked: string;
        totalComments: number;
        myList: {
            id: number;
        }[];
        visibility: "public" | "private";
    }>;
    createPost(userId: number, address_name: string, category_group_code: string, category_group_name: string, category_name: string, kakao_place_id: string, phone: string, place_name: string, road_address_name: string, x: string, y: string, myListIds: number[], content: string, rating: number, visibility: any, hashtagNames: string[], files: Express.Multer.File[]): Promise<{
        postId: number;
    }>;
    updatePost(id: number, address_name: string, category_group_code: string, category_group_name: string, category_name: string, kakao_place_id: string, phone: string, place_name: string, road_address_name: string, x: string, y: string, myListId: number[], content: string, rating: number, visibility: any, hashtagNames: string[], newFiles: Express.Multer.File[], originalFiles: string[]): Promise<{
        postId: number;
    }>;
    deletePost(id: number): Promise<void>;
    getPostsByMyId(userId: number): Promise<{
        id: number;
        content: string;
        rating: number;
        updated_at: Date;
        user: import("../user/entities/user.entity").User;
        restaurant: Restaurant;
        images: import("./entities/image.entity").Image[];
        hashtags: string[];
        totalLikes: number;
        isLiked: any;
        totalComments: number;
        myList: CollectionItem[];
        visibility: "public" | "private";
    }[]>;
    getPostsByOtherUserId(userId: number, myUserId: number): Promise<{
        id: number;
        content: string;
        rating: number;
        updated_at: Date;
        user: import("../user/entities/user.entity").User;
        restaurant: Restaurant;
        images: import("./entities/image.entity").Image[];
        hashtags: string[];
        totalLikes: number;
        isLiked: any;
        totalComments: number;
        myList: CollectionItem[];
        visibility: "public" | "private";
    }[]>;
    getTrendingPosts(): Promise<any>;
    getPostsAroundMe(x: string, y: string, userId: any): Promise<{
        id: number;
        content: string;
        rating: number;
        updated_at: Date;
        user: import("../user/entities/user.entity").User;
        restaurant: Restaurant;
        images: import("./entities/image.entity").Image[];
        hashtags: import("./entities/hashtag.entity").Hashtag[];
        totalLikes: number;
        isLiked: any;
        totalComments: number;
        myList: any;
        visibility: "public" | "private";
    }[]>;
}
