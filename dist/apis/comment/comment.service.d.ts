import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { CommentLikeService } from './comment-like.service';
import { Post } from '../post/entities/post.entity';
export declare class CommentService {
    private commentRepository;
    private postRepository;
    private readonly commentLikeService;
    constructor(commentRepository: Repository<Comment>, postRepository: Repository<Post>, commentLikeService: CommentLikeService);
    getAllComments(postId: number, userId: number): Promise<{
        id: number;
        content: string;
        updated_at: Date;
        user: import("../user/entities/user.entity").User;
        totalLikes: number;
        isLiked: any;
    }[]>;
    createComment(postId: number, userId: number, content: string): Promise<import("typeorm").InsertResult>;
    updateComment(postId: number, commentId: number, content: string): Promise<void>;
    deleteComment(postId: number, commentId: number): Promise<void>;
}
