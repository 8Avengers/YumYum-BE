import { AdminService } from './admin.service';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    userWithdrawal(userId: number): Promise<void>;
    userBanLists(userId: number): Promise<void>;
    updateRestaurant(restaurantId: number): Promise<void>;
    deletePost(postId: number): Promise<void>;
    deleteComment(commentId: number): Promise<void>;
}
