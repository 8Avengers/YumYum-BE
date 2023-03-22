/// <reference types="multer" />
import { UserProfileService } from './user-profile.service';
import { User } from './entities/user.entity';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { PostService } from '../post/post.service';
export declare class UserProfileController {
    private readonly userProfileService;
    private readonly postService;
    constructor(userProfileService: UserProfileService, postService: PostService);
    getMyProfile(user: User): Promise<{
        id: number;
        nickname: string;
        introduce: string;
        profile_image: string;
    }>;
    updateMyProfile(user: any, file: Express.Multer.File, updateUserProfileDto: UpdateUserProfileDto): Promise<{
        id: number;
        nickname: string;
        introduce: string;
        profile_image: string;
    }>;
    deleteUser(user: any): Promise<boolean>;
    getUserProfile(userId: number, currentUser?: User): Promise<{
        id: number;
        nickname: string;
        introduce: string;
        profile_image: string;
        follow_relationship: any;
    }>;
    getUserIdPosts(userId: number, currentUser: User, page: string): Promise<{
        id: number;
        content: string;
        rating: number;
        updated_at: Date;
        user: User;
        restaurant: import("../restaurant/entities/restaurant.entity").Restaurant;
        images: import("../post/entities/image.entity").Image[];
        hashtags: string[];
        totalLikes: number;
        isLiked: any;
        totalComments: number;
        myList: import("../collection/entities/collection-item.entity").CollectionItem[];
        visibility: "public" | "private";
    }[]>;
    followUser(follower: User, followingId: number): Promise<string>;
    getFollowersOfUser(userId: number): Promise<{
        id: number;
        nickname: string;
        profile_image: string;
    }[]>;
    getFollowingsOfUser(userId: number): Promise<{
        id: number;
        nickname: string;
        profile_image: string;
    }[]>;
}
