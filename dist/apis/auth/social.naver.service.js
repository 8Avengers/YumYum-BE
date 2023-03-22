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
exports.SocialNaverService = void 0;
const axios_1 = require("@nestjs/axios");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const rxjs_1 = require("rxjs");
let SocialNaverService = class SocialNaverService {
    constructor(configService, httpService) {
        this.configService = configService;
        this.httpService = httpService;
        this.clientId = this.configService.get('OAUTH2_NAVER_CLIENT_ID');
        this.clientSecert = this.configService.get('OAUTH2_NAVER_CLIENT_SECRET');
        this.redirectUri = this.configService.get('OAUTH2_NAVER_REDIRECT_URI');
    }
    async getOauth2Token({ code, state }) {
        const response = await (0, rxjs_1.lastValueFrom)(this.httpService.get('https://nid.naver.com/oauth2.0/token', {
            params: {
                grant_type: 'authorization_code',
                client_id: this.clientId,
                client_secret: this.clientSecert,
                code,
                state,
            },
        })).catch((err) => {
            throw new common_1.BadRequestException({
                message: '로그인 요청이 잘못되었습니다.',
            });
        });
        return response.data;
    }
    async getUserInfo(accessToken) {
        const response = await (0, rxjs_1.lastValueFrom)(this.httpService.get('https://openapi.naver.com/v1/nid/me', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })).catch((err) => {
            throw new common_1.BadRequestException({
                message: '올바르지 않은 접근입니다.',
            });
        });
        return response.data.response;
    }
};
SocialNaverService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        axios_1.HttpService])
], SocialNaverService);
exports.SocialNaverService = SocialNaverService;
//# sourceMappingURL=social.naver.service.js.map