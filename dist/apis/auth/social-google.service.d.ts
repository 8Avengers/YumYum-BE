import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
export declare class SocialGoogleService {
    private httpService;
    private configService;
    private clientId;
    private clientSecret;
    private redirectUri;
    constructor(httpService: HttpService, configService: ConfigService);
    getAccessTokenFromGoogle(code: string): Promise<any>;
    getGoogleUserProfile(accessToken: string): Promise<{
        email: any;
        nickname: any;
        name: any;
    }>;
}
