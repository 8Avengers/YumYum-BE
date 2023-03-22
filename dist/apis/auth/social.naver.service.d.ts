import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { SocialLoginBodyDTO } from './dto/social-login.dto';
export declare class SocialNaverService {
    private configService;
    private httpService;
    private clientId;
    private clientSecert;
    private redirectUri;
    constructor(configService: ConfigService, httpService: HttpService);
    getOauth2Token({ code, state }: SocialLoginBodyDTO): Promise<any>;
    getUserInfo(accessToken: string): Promise<any>;
}
