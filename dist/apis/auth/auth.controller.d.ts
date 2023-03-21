import { AuthService } from './auth.service';
import { UserProfileService } from '../user/user-profile.service';
import { LoginUserDto } from '../user/dto/login-user.dto';
import { OauthPassportDto } from './dto/oauth-passport.dto';
export declare class AuthController {
    private readonly userProfileService;
    private readonly authService;
    constructor(userProfileService: UserProfileService, authService: AuthService);
    loginEmail(loginUserDto: LoginUserDto): Promise<{
        refreshToken: string;
        accessToken: string;
        user: {
            userId: number;
            nickname: string;
            email: string;
            profileImage: string;
        };
    }>;
    loginGoogle(user: OauthPassportDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: any;
    }>;
    loginKakao(user: OauthPassportDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: any;
    }>;
    loginNaver(user: OauthPassportDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: any;
    }>;
    restoreAccessToken(currentUser: any): Promise<{
        accessToken: string;
    }>;
}
