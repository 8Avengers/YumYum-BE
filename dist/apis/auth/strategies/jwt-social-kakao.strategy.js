"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtKakaoStrategy = void 0;
const passport_1 = require("@nestjs/passport");
const passport_kakao_1 = require("passport-kakao");
class JwtKakaoStrategy extends (0, passport_1.PassportStrategy)(passport_kakao_1.Strategy, 'kakao') {
    constructor() {
        super({
            clientID: process.env.KAKAO_CLIENT_ID_RESTAPI,
            clientSecret: process.env.KAKAO_CLIENT_SECRET,
            callbackURL: process.env.KAKAO_CALLBACKURL,
            scope: ['account_email', 'profile_nickname'],
        });
    }
    validate(accessToken, refreshToken, profile) {
        console.log('accessToken카카오찍어보자::::::::', accessToken);
        console.log('refreshToken카카오찍어보자::::::::', refreshToken);
        console.log('카카오 프로필찍어', profile);
        return {
            email: profile._json.kakao_account.email,
            nickname: profile.displayName,
        };
    }
}
exports.JwtKakaoStrategy = JwtKakaoStrategy;
//# sourceMappingURL=jwt-social-kakao.strategy.js.map