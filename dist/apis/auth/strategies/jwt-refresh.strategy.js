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
exports.JwtRefreshStrategy = void 0;
const passport_1 = require("@nestjs/passport");
const passport_jwt_1 = require("passport-jwt");
const config_1 = require("@nestjs/config");
const common_1 = require("@nestjs/common");
let JwtRefreshStrategy = class JwtRefreshStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy, 'refresh') {
    constructor(configService) {
        super({
            jwtFromRequest: (req) => {
                const cookie = req.headers.cookie;
                const refreshToken = cookie.replace('refreshToken=', '');
                console.log('내가만든쿠키::::::::::::', cookie);
                console.log('내가추출한리프레시::::::::', refreshToken);
                return refreshToken;
            },
            secretOrKey: configService.get('JWT_REFRESH_TOKEN_SECRET') || 'refreshToken',
        });
        this.configService = configService;
    }
    validate(payload) {
        console.log('리프레시!!payload:::::::::::::::::::', payload);
        return {
            email: payload.email,
            id: payload.id,
            profileImage: payload.profileImage,
        };
    }
};
JwtRefreshStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], JwtRefreshStrategy);
exports.JwtRefreshStrategy = JwtRefreshStrategy;
//# sourceMappingURL=jwt-refresh.strategy.js.map