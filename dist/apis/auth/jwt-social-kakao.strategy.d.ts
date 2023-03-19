import { Strategy, Profile } from 'passport-kakao';
declare const JwtKakaoStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtKakaoStrategy extends JwtKakaoStrategy_base {
    constructor();
    validate(accessToken: string, refreshToken: string, profile: Profile): {
        email: any;
        name: string;
    };
}
export {};
