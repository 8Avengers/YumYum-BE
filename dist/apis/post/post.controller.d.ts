/// <reference types="multer" />
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { CreateRestaurantDto } from '../restaurant/dto/create-restaurant.dto';
export declare class PostController {
    private readonly postService;
    constructor(postService: PostService);
    getPostById(postId: number, currentUser: any): Promise<{
        id: number;
        content: string;
        rating: number;
        updated_at: Date;
        user: import("../user/entities/user.entity").User;
        restaurant: import("../restaurant/entities/restaurant.entity").Restaurant;
        images: import("./entities/image.entity").Image[];
        totalLikes: number;
        hashtags: {
            name: string;
        }[];
        isLiked: string;
        totalComments: number;
        myListId: number[];
        visibility: "public" | "private";
        isBookmarked: string;
    }>;
    getPosts(currentUser: any, page: string): Promise<{
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
        myList: number[];
        visibility: "public" | "private";
        isBookmarked: string;
    }[]>;
    createPost(files: Array<Express.Multer.File>, data: CreatePostDto, { address_name, category_group_code, category_group_name, category_name, id, phone, place_name, road_address_name, x, y, }: CreateRestaurantDto, currentUser: any): Promise<{
        postId: number;
    }>;
    updatePost(files: Array<Express.Multer.File>, postId: number, data: Partial<UpdatePostDto>, { address_name, category_group_code, category_group_name, category_name, id, phone, place_name, road_address_name, x, y, }: Partial<CreateRestaurantDto>): Promise<{
        postId: number;
    }>;
    deletePost(postId: number): Promise<void>;
    getTrendingPostsByCategory(category: string): Promise<any>;
    getPostsAroundMe(currentUser: any, page: string, x: string, y: string): Promise<{
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
        visibility: "public" | "private";
        isBookmarked: string;
    }[]>;
}
