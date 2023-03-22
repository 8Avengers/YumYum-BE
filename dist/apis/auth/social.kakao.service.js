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
exports.SocialKakaoService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const rxjs_1 = require("rxjs");
const axios_1 = require("@nestjs/axios");
let SocialKakaoService = class SocialKakaoService {
    constructor(configService, httpService) {
        this.configService = configService;
        this.httpService = httpService;
        this.clientId = this.configService.get('KAKAO_CLIENT_ID_RESTAPI');
        this.clientSecert = this.configService.get('KAKAO_CLIENT_SECRET');
        this.redirectUri = this.configService.get('KAKAO_CALLBACKURL');
    }
    async getOauth2Token({ code }) {
        const response = await (0, rxjs_1.lastValueFrom)(this.httpService.get('https://kauth.kakao.com/oauth/token', {
            params: {
                grant_type: 'authorization_code',
                client_id: this.clientId,
                client_secret: this.clientSecert,
                redirect_uri: this.redirectUri,
                code,
            },
        })).catch((err) => {
            throw new common_1.BadRequestException({
                message: '로그인 요청이 잘못되었습니다.',
            });
        });
        console.log('social.kakao.service.ts에서 getOauth2Token를 실행을 무엇을 리턴해줄까?', response.data);
        return response.data;
    }
    async getUserInfo(accessToken) {
        const response = await (0, rxjs_1.lastValueFrom)(this.httpService.get('https://kapi.kakao.com/v2/user/me', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })).catch((err) => {
            throw new common_1.BadRequestException({
                message: '올바르지 않은 접근입니다.',
            });
        });
        console.log('social.kakao.service.ts에서 getUserInfo 를 실행후 무엇을 리턴해줄까?', response.data);
        return response.data;
    }
};
SocialKakaoService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        axios_1.HttpService])
], SocialKakaoService);
exports.SocialKakaoService = SocialKakaoService;
//# sourceMappingURL=social.kakao.service.js.map