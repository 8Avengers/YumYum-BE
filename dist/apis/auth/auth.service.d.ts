import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserSignupService } from '../user/user-signup.service';
export declare class AuthService {
    private readonly jwtService;
    private readonly configService;
    private readonly userSignupService;
    constructor(jwtService: JwtService, configService: ConfigService, userSignupService: UserSignupService);
    createAccessToken({ user }: {
        user: any;
    }): string;
    createRefreshToken({ user }: {
        user: any;
    }): string;
    signupOauth({ user }: {
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
    loginOauth({ user }: {
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
