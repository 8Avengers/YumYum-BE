import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Collection } from '../collection/entities/collection.entity';
export declare class UserSignupService {
    private readonly userRepository;
    private readonly collectionRepository;
    constructor(userRepository: Repository<User>, collectionRepository: Repository<Collection>);
    findOne({ email }: {
        email: any;
    }): Promise<User>;
    getUserById(id: any): Promise<User>;
    createLocalUser({ email, hashedPassword, nickname, name, gender, birth, phoneNumber, }: {
        email: any;
        hashedPassword: any;
        nickname: any;
        name: any;
        gender: any;
        birth: any;
        phoneNumber: any;
    }): Promise<{
        email: any;
        password: any;
        nickname: any;
        name: any;
        gender: any;
        birth: any;
        phone_number: any;
        profile_image: string;
        provider: "local";
    } & User>;
    createOauthUser({ email, nickname, name, provider, provider_id }: {
        email: any;
        nickname: any;
        name: any;
        provider: any;
        provider_id: any;
    }): Promise<{
        email: any;
        nickname: any;
        name: any;
        provider: any;
        provider_id: any;
        profile_image: string;
    } & User>;
    createUserWithPassport({ email, nickname, name }: {
        email: any;
        nickname: any;
        name: any;
    }): Promise<{
        email: any;
        nickname: any;
        name: any;
        profile_image: string;
    } & User>;
}
