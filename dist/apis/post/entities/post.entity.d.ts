import { Restaurant } from '../../restaurant/entities/restaurant.entity';
import { User } from '../../user/entities/user.entity';
import { Hashtag } from './hashtag.entity';
import { Image } from './image.entity';
import { PostLike } from './post-like.entity';
import { Comment } from '../../comment/entities/comment.entity';
import { PostUserTag } from './post-usertag.entity';
import { CollectionItem } from '../../collection/entities/collection-item.entity';
export declare class Post {
    id: number;
    content: string;
    rating: number;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;
    visibility: 'public' | 'private';
    restaurant: Restaurant;
    images: Image[];
    postLikes: PostLike[];
    comments: Comment[];
    user: User;
    hashtags: Hashtag[];
    collectionItems: CollectionItem[];
    postUserTags: PostUserTag[];
}
