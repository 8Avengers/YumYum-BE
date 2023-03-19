import { UploadService } from './../upload/upload.service';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Follow } from './entities/follow.entity';
export declare class UserProfileService {
    private readonly userRepository;
    private FollowRepository;
    private readonly uploadService;
    constructor(userRepository: Repository<User>, FollowRepository: Repository<Follow>, uploadService: UploadService);
    findByEmail({ email }: {
        email: any;
    }): Promise<User>;
    getUserById(id: any): Promise<User>;
    getUserByNickname(nickname: string): Promise<User>;
    updateUserProfile({ updateUserProfileDto, user, file }: {
        updateUserProfileDto: any;
        user: any;
        file: any;
    }): Promise<{
        id: number;
        nickname: string;
        introduce: string;
        profile_image: string;
    }>;
    deleteUser(user: any): Promise<boolean>;
    checkUserFollowRelation(followerId: number, followingId: number): Promise<boolean>;
    followUser(follower: User, followingId: number): Promise<User>;
    getFollowByFollowerAndFollowingIds(followerId: number, followingId: number): Promise<Follow>;
    createUserFollowRelation(follower: User, followingId: number): Promise<User>;
    deleteUserFollowRelation(follower: User, followingId: number): Promise<User>;
    getFollowers(userId: number): Promise<{
        id: number;
        nickname: string;
        profile_image: string;
    }[]>;
    getFollowings(userId: number): Promise<{
        id: number;
        nickname: string;
        profile_image: string;
    }[]>;
}
