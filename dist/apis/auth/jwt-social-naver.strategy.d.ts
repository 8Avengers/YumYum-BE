import { Strategy, Profile } from 'passport-naver';
declare const JwtNaverStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtNaverStrategy extends JwtNaverStrategy_base {
    constructor();
    validate(accessToken: string, refreshToken: string, profile: Profile): {
        email: string;
    };
}
export {};
