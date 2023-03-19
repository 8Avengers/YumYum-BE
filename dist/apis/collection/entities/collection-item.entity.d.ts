import { Post } from '../../post/entities/post.entity';
import { Restaurant } from '../../restaurant/entities/restaurant.entity';
import { Collection } from './collection.entity';
export declare class CollectionItem {
    id: number;
    collection: Collection;
    restaurant: Restaurant;
    post: Post;
}
