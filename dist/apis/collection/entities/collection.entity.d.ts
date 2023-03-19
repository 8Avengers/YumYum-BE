import { User } from '../../user/entities/user.entity';
import { CollectionItem } from './collection-item.entity';
export declare class Collection {
    id: number;
    type: string;
    name: string;
    description: string;
    image: string;
    user_id: number;
    visibility: 'public' | 'private';
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
    collectionItems: CollectionItem[];
    user: User;
}
