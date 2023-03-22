import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { SocialLoginBodyDTO } from './dto/social-login.dto';
export declare class SocialGoogleService {
    private configService;
    private httpService;
    private clientId;
    private clientSecret;
    private redirectUri;
    constructor(configService: ConfigService, httpService: HttpService);
    getOauth2Token({ code }: SocialLoginBodyDTO): Promise<any>;
    getUserInfo(accessToken: string): Promise<any>;
}
