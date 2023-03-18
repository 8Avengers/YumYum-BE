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
        myList: import("../collection/entities/collection-item.entity").CollectionItem[];
        visibility: "public" | "private";
    }>;
    getPosts(currentUser: any): Promise<{
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
    createPost(files: Array<Express.Multer.File>, data: CreatePostDto, { address_name, category_group_code, category_group_name, category_name, id, phone, place_name, road_address_name, x, y, }: CreateRestaurantDto, currentUser: any): Promise<{
        postId: number;
    }>;
    updateArticle(files: Array<Express.Multer.File>, postId: number, data: Partial<UpdatePostDto>, { address_name, category_group_code, category_group_name, category_name, id, phone, place_name, road_address_name, x, y, }: Partial<CreateRestaurantDto>): Promise<{
        postId: number;
    }>;
    deletePost(postId: number): Promise<void>;
}
