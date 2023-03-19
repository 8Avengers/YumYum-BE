import { CommentLikeService } from './comment-like.service';
export declare class CommentLikeController {
    private readonly commentLikeService;
    constructor(commentLikeService: CommentLikeService);
    likeComment(commentId: number, currentUser: any): Promise<void>;
    unlikeComment(commentId: number, currentUser: any): Promise<void>;
}
