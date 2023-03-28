import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
export declare class AdminService {
    private userRepository;
    constructor(userRepository: Repository<User>);
    userWithdrawal(userId: number): Promise<void>;
    userBanLists(userId: number): Promise<void>;
    updateRestaurant(userId: number): Promise<void>;
    deletePost(postId: number): Promise<void>;
    deleteComment(commentId: number): Promise<void>;
}
