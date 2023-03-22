import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
declare const JwtAccessStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtAccessStrategy extends JwtAccessStrategy_base {
    private configService;
    constructor(configService: ConfigService);
    validate(payload: any): {
        email: any;
        id: any;
        nickname: any;
        profileImage: any;
    };
}
export {};
