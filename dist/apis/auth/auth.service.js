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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const user_signup_service_1 = require("../user/user-signup.service");
let AuthService = class AuthService {
    constructor(jwtService, configService, userSignupService) {
        this.jwtService = jwtService;
        this.configService = configService;
        this.userSignupService = userSignupService;
    }
    createAccessToken({ user }) {
        console.log('acessToken의 유저', user);
        const accessToken = this.jwtService.sign({
            email: user.email,
            id: user.id,
            nickname: user.nickname,
            profileImage: user.profile_image,
        }, {
            secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
            expiresIn: '14d',
        });
        return accessToken;
    }
    createRefreshToken({ user }) {
        console.log('refreshToken의 유저', user);
        const refreshToken = this.jwtService.sign({
            id: user.id,
        }, {
            secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
            expiresIn: '14d',
        });
        return refreshToken;
    }
    async signupOauth({ user }) {
        console.log('oauth 끝나면 나오는 유저찍어보자', user);
        let existingUser = await this.userSignupService.findOne({
            email: user.email,
        });
        if (existingUser)
            throw new common_1.ConflictException('이미 등록된 이메일입니다. 소셜로그인해주세요.');
        try {
            if (!existingUser) {
                user = await this.userSignupService.createOauthUser({
                    email: user.email,
                    nickname: user.nickname,
                    name: user.name,
                });
            }
        }
        catch (error) {
            if (error instanceof common_1.ConflictException) {
                console.error(`Error:  ${error.message}`);
            }
            else {
                throw error;
            }
        }
        const accessToken = await this.createAccessToken({ user });
        const refreshToken = await this.createRefreshToken({ user });
        return {
            refreshToken,
            accessToken,
            user: {
                userId: user.id,
                nickname: user.nickname,
                email: user.email,
                profileImage: user.profile_image,
            },
        };
    }
    async loginOauth({ user }) {
        console.log('oauth 끝나면 나오는 유저찍어보자', user);
        try {
            let existingUser = await this.userSignupService.findOne({
                email: user.email,
            });
            if (!existingUser) {
                user = await this.userSignupService.createOauthUser({
                    email: user.email,
                    nickname: user.nickname,
                    name: user.name,
                });
            }
        }
        catch (error) {
            if (error instanceof common_1.ConflictException) {
                console.error(`Error:  ${error.message}`);
            }
            else {
                throw error;
            }
        }
        const accessToken = await this.createAccessToken({ user });
        const refreshToken = await this.createRefreshToken({ user });
        return {
            refreshToken,
            accessToken,
            user: {
                userId: user.id,
                nickname: user.nickname,
                email: user.email,
                profileImage: user.profile_image,
            },
        };
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        config_1.ConfigService,
        user_signup_service_1.UserSignupService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map