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
exports.SocialGoogleService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const rxjs_1 = require("rxjs");
const axios_1 = require("@nestjs/axios");
let SocialGoogleService = class SocialGoogleService {
    constructor(httpService, configService) {
        this.httpService = httpService;
        this.configService = configService;
        this.clientId = configService.get('GOOGLE_CLIENTID');
        this.clientSecret = configService.get('GOOGLE_CLIENTSECRET');
        this.redirectUri = configService.get('GOOGLE_CALLBACKURL');
    }
    async getAccessTokenFromGoogle(code) {
        console.log('Inside getAccessTokenFromGoogle method');
        console.log('getAccessTokenFromGoogle내부의code가 들어오나?!!', code);
        const response = await (0, rxjs_1.lastValueFrom)(this.httpService.post('https://oauth2.googleapis.com/token', null, {
            params: {
                code,
                client_id: this.clientId,
                client_secret: this.clientSecret,
                redirect_uri: this.redirectUri,
                grant_type: 'authorization_code',
            },
        })).catch((err) => {
            var _a;
            console.error('Error in getAccessTokenFromGoogle:', err);
            throw new common_1.BadRequestException({
                message: 'Invalid login request.',
                error: (_a = err.response) === null || _a === void 0 ? void 0 : _a.data,
            });
        });
        return response.data.access_token;
    }
    async getGoogleUserProfile(accessToken) {
        const googleProfileUrl = 'https://www.googleapis.com/oauth2/v2/userinfo';
        const headers = {
            Authorization: `Bearer ${accessToken}`,
        };
        try {
            const response = await (0, rxjs_1.lastValueFrom)(this.httpService.get(googleProfileUrl, { headers }));
            return {
                email: response.data.email,
                nickname: response.data.name,
                name: response.data.family_name,
            };
        }
        catch (error) {
            const axiosError = error;
            if (axiosError.response) {
                throw new common_1.BadRequestException(axiosError.response.data);
            }
            throw error;
        }
    }
};
SocialGoogleService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService,
        config_1.ConfigService])
], SocialGoogleService);
exports.SocialGoogleService = SocialGoogleService;
//# sourceMappingURL=social-google.service.js.map