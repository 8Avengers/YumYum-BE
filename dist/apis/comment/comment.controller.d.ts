import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
export declare class CommentController {
    private readonly commentService;
    constructor(commentService: CommentService);
    getAllComments(postId: number, currentUser: any): Promise<{
        id: number;
        content: string;
        updated_at: Date;
        user: import("../user/entities/user.entity").User;
        totalLikes: number;
        isLiked: any;
    }[]>;
    createComment(postId: number, data: CreateCommentDto, currentUser: any): Promise<import("typeorm").InsertResult>;
    updateComment(postId: number, commentId: number, data: UpdateCommentDto): Promise<void>;
    deleteComment(postId: number, commentId: number): Promise<void>;
}
