import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { SocialLoginBodyDTO } from './dto/social-login.dto';
export declare class SocialKakaoService {
    private configService;
    private httpService;
    private clientId;
    private clientSecert;
    private redirectUri;
    constructor(configService: ConfigService, httpService: HttpService);
    getOauth2Token({ code }: SocialLoginBodyDTO): Promise<any>;
    getUserInfo(accessToken: string): Promise<any>;
}
