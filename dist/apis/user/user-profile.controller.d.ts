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
        name: string;
        email: string;
        nickname: string;
        introduce: string;
        profile_image: string;
    }>;
    updateMyProfile(user: any, file: Express.Multer.File, updateUserProfileDto: UpdateUserProfileDto): Promise<{
        id: number;
        name: string;
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
    getUserIdPosts(userId: number, currentUser: User, page: string): Promise<any>;
    followUser(follower: User, followingId: number): Promise<string>;
    getFollowersOfUser(userId: number, page: string): Promise<{
        id: number;
        nickname: string;
        profile_image: string;
    }[]>;
    getFollowingsOfUser(userId: number, page: string): Promise<{
        id: number;
        nickname: string;
        profile_image: string;
    }[]>;
}
