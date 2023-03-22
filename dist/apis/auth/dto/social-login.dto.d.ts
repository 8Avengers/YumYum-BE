export declare class SocialLoginProviderDTO {
    provider: 'kakao' | 'naver' | 'google';
}
export declare class SocialLoginBodyDTO {
    code: string;
    state?: string;
}
