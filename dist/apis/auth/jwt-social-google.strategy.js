"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtGoogleStrategy = void 0;
const passport_1 = require("@nestjs/passport");
const passport_google_oauth20_1 = require("passport-google-oauth20");
class JwtGoogleStrategy extends (0, passport_1.PassportStrategy)(passport_google_oauth20_1.Strategy, 'google') {
    constructor() {
        super({
            clientID: '1018735614364-pdqtjs0an5ga6m999s797e7or2363fc6.apps.googleusercontent.com',
            clientSecret: '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',
            callbackURL: 'http://localhost:3000/login/google',
            scope: ['email', 'profile'],
        });
    }
    validate(googleToken, refreshToken, profile) {
        console.log('구글의 accessToken ::::::::', googleToken);
        console.log('구글의 refreshToken ::::::::', refreshToken);
        console.log('프로필찍어보자:::::::::::::::::::', profile);
        return {
            email: profile.emails[0].value,
            nickname: profile.displayName,
            name: profile.name.familyName,
        };
    }
}
exports.JwtGoogleStrategy = JwtGoogleStrategy;
//# sourceMappingURL=jwt-social-google.strategy.js.map