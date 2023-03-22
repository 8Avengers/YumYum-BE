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
    constructor(configService, httpService) {
        this.configService = configService;
        this.httpService = httpService;
        this.clientId = this.configService.get('GOOGLE_CLIENTID');
        this.clientSecret = this.configService.get('GOOGLE_CLIENTSECRET');
        this.redirectUri = this.configService.get('GOOGLE_CALLBACKURL');
    }
    async getOauth2Token({ code }) {
        console.log("code가 socialgoogleservice에 들어오는가", code);
        try {
            const response = await (0, rxjs_1.lastValueFrom)(this.httpService.post('https://oauth2.googleapis.com/token', null, {
                params: {
                    code,
                    client_id: this.clientId,
                    client_secret: this.clientSecret,
                    redirect_uri: this.redirectUri,
                    grant_type: 'authorization_code',
                },
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }));
            console.log('getOauth2Token from social-google.service.ts?', response.data);
            return response.data;
        }
        catch (err) {
            console.error(err);
            throw new common_1.BadRequestException({
                message: 'Invalid login request.',
            });
        }
    }
    async getUserInfo(accessToken) {
        const response = await (0, rxjs_1.lastValueFrom)(this.httpService.get('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })).catch((err) => {
            throw new common_1.BadRequestException({
                message: 'Invalid access.',
            });
        });
        console.log('getUserInfo from social-google.service.ts?', response.data);
        return response.data;
    }
};
SocialGoogleService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        axios_1.HttpService])
], SocialGoogleService);
exports.SocialGoogleService = SocialGoogleService;
//# sourceMappingURL=social-google.service.js.map