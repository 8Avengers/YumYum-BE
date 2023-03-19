import { Repository } from 'typeorm';
import { CommentLike } from './entities/comment-like.entity';
import { Comment } from './entities/comment.entity';
export declare class CommentLikeService {
    private readonly commentLikeRepository;
    private readonly commentRepository;
    constructor(commentLikeRepository: Repository<CommentLike>, commentRepository: Repository<Comment>);
    getLikesForComment(commentId: number): Promise<number>;
    getLikesForAllComments(commentIds: number[]): Promise<{
        commentId: number;
        totalLikes: number;
    }[]>;
    getLikedStatusforAllComments(commentIds: any, userId: any): Promise<any>;
    likeComment(commentId: any, userId: any): Promise<void>;
    unlikeComment(commentId: any, userId: any): Promise<void>;
}
