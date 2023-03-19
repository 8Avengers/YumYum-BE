import { CreateUserDto } from './dto/create-user.dto';
import { UserSignupService } from './user-signup.service';
export declare class UserSignupController {
    private readonly userSignupService;
    constructor(userSignupService: UserSignupService);
    signUp(createUserDto: CreateUserDto): Promise<{
        message: string;
        error?: undefined;
    } | {
        error: any;
        message?: undefined;
    }>;
}
