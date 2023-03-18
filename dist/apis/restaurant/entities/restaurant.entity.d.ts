import { Post } from '../../post/entities/post.entity';
import { CollectionItem } from '../../collection/entities/collection-item.entity';
export declare class Restaurant {
    id: number;
    address_name: string;
    category_group_code: string;
    category_group_name: string;
    category_name: string;
    kakao_place_id: string;
    phone: string;
    place_name: string;
    road_address_name: string;
    x: string;
    y: string;
    createdAt: Date;
    updatedAt: Date;
    deleted_at: Date;
    posts: Post[];
    collectionItems: CollectionItem[];
}
