import { Post } from './post.entity';
export declare class Hashtag {
    id: number;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    deleted_at: Date;
    posts: Post[];
}
