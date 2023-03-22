import { AuthService } from './auth.service';
import { UserProfileService } from '../user/user-profile.service';
import { LoginUserDto } from '../user/dto/login-user.dto';
import { OauthPassportDto } from './dto/oauth-passport.dto';
import { SocialLoginBodyDTO } from './dto/social-login.dto';
export declare class AuthController {
    private readonly userProfileService;
    private readonly authService;
    constructor(userProfileService: UserProfileService, authService: AuthService);
    oauthSignIn(provider: string, body: SocialLoginBodyDTO): Promise<{
        refreshToken: string;
        accessToken: string;
        user: {
            userId: any;
            nickname: any;
            email: any;
            profileImage: any;
        };
    }>;
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
    restoreAccessToken(currentUser: any): Promise<{
        accessToken: string;
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
}
