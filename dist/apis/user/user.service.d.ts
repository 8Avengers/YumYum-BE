import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
export declare class UserService {
    private readonly userRepository;
    constructor(userRepository: Repository<User>);
    findByEmail({ email }: {
        email: any;
    }): Promise<User>;
    getUserById(id: any): Promise<User>;
    getUserByNickname(nickname: string): Promise<User>;
}
