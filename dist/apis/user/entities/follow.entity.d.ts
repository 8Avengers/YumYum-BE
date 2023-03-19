import { User } from './user.entity';
export declare class Follow {
    id: number;
    follower: User;
    following: User;
    created_at: Date;
    updated_at: Date;
}
