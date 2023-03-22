import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserSignupService } from '../user/user-signup.service';
import { SocialLoginBodyDTO } from './dto/social-login.dto';
import { SocialGoogleService } from './social-google.service';
import { SocialKakaoService } from './social-kakao.service';
import { SocialNaverService } from './social-naver.service';
export declare class AuthService {
    private readonly jwtService;
    private readonly configService;
    private readonly userSignupService;
    private socialKaKaoService;
    private socialNaverService;
    private readonly socialGoogleService;
    constructor(jwtService: JwtService, configService: ConfigService, userSignupService: UserSignupService, socialKaKaoService: SocialKakaoService, socialNaverService: SocialNaverService, socialGoogleService: SocialGoogleService);
    oauthLoginGoogle(provider: 'kakao' | 'naver' | 'google', body: SocialLoginBodyDTO): Promise<void>;
    oauthLoginKakao(provider: 'kakao' | 'naver' | 'google', body: SocialLoginBodyDTO): Promise<{
        refreshToken: string;
        accessToken: string;
        user: {
            userId: any;
            nickname: any;
            email: any;
            profileImage: any;
        };
    }>;
    createAccessToken({ user }: {
        user: any;
    }): string;
    createRefreshToken({ user }: {
        user: any;
    }): string;
    loginOauthByPassport({ user }: {
        user: any;
    }): Promise<{
        refreshToken: string;
        accessToken: string;
        user: {
            userId: any;
            nickname: any;
            email: any;
            profileImage: any;
        };
    }>;
}
