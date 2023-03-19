"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtNaverStrategy = void 0;
const passport_1 = require("@nestjs/passport");
const common_1 = require("@nestjs/common");
const passport_naver_1 = require("passport-naver");
let JwtNaverStrategy = class JwtNaverStrategy extends (0, passport_1.PassportStrategy)(passport_naver_1.Strategy, 'naver') {
    constructor() {
        super({
            clientID: '3NECxObNoFoTyWJWe4bs',
            clientSecret: '6aXyVRv8gB',
            callbackURL: 'http://localhost:3000/login/naver',
            scope: ['email', 'profile'],
        });
    }
    validate(accessToken, refreshToken, profile) {
        console.log('accessToken네이버찍어보자::::::::', accessToken);
        console.log('refreshToken네이버찍어보자::::::::', refreshToken);
        console.log('네이버 프로필찍어보자:::::::::::::::::::', profile);
        return {
            email: profile._json.email,
        };
    }
};
JwtNaverStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], JwtNaverStrategy);
exports.JwtNaverStrategy = JwtNaverStrategy;
//# sourceMappingURL=jwt-social-naver.strategy.js.map