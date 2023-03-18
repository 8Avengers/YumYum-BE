import { Repository } from 'typeorm';
import { PostLike } from './entities/post-like.entity';
import { Post } from './entities/post.entity';
export declare class PostLikeService {
    private readonly postLikeRepository;
    private readonly postRepository;
    constructor(postLikeRepository: Repository<PostLike>, postRepository: Repository<Post>);
    getLikesForPost(postId: number): Promise<number>;
    getLikesForAllPosts(postIds: number[]): Promise<{
        postId: number;
        totalLikes: number;
    }[]>;
    getLikedStatusforOnePost(postId: number, userId: number): Promise<{
        isLiked: string;
    }>;
    getLikedStatusforAllPosts(postIds: any, userId: any): Promise<any>;
    likePost(postId: any, userId: any): Promise<void>;
    unlikePost(postId: any, userId: any): Promise<void>;
}
