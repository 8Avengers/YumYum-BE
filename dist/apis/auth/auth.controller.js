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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const common_2 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const bcrypt = require("bcrypt");
const common_3 = require("@nestjs/common");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const user_profile_service_1 = require("../user/user-profile.service");
const login_user_dto_1 = require("../user/dto/login-user.dto");
const passport_1 = require("@nestjs/passport");
const auth_guards_1 = require("./guards/auth.guards");
const oauth_user_dto_1 = require("../user/dto/oauth-user.dto");
const auth_decorators_1 = require("./auth.decorators");
const swagger_1 = require("@nestjs/swagger");
let AuthController = class AuthController {
    constructor(userProfileService, authService) {
        this.userProfileService = userProfileService;
        this.authService = authService;
    }
    async loginEmail(loginUserDto) {
        const { email, password } = loginUserDto;
        const user = await this.userProfileService.findByEmail({ email });
        if (!user)
            throw new common_2.UnprocessableEntityException(' 등록된 이메일이 없습니다.');
        const isAuth = await bcrypt.compare(password, user.password);
        if (!isAuth)
            throw new common_2.UnprocessableEntityException('비밀번호가 일치하지 않습니다.');
        const accessToken = this.authService.createAccessToken({
            user,
        });
        const refreshToken = this.authService.createRefreshToken({ user });
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
    async signupGoogle(user) {
        return this.authService.signupOauth({ user });
    }
    async loginGoogle(user) {
        return this.authService.loginOauth({ user });
    }
    async signupNaver(user) {
        return this.authService.signupOauth({ user });
    }
    async loginNaver(user) {
        return this.authService.loginOauth({ user });
    }
    async signupKakao(user) {
        return this.authService.signupOauth({ user });
    }
    async loginKakao(user) {
        return this.authService.loginOauth({ user });
    }
    async restoreAccessToken(currentUser) {
        const accessToken = this.authService.createAccessToken({
            user: currentUser,
        });
        return { accessToken };
    }
};
__decorate([
    (0, auth_decorators_1.loginEmail)(),
    (0, common_1.Post)('/login'),
    __param(0, (0, common_1.Body)(common_3.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_user_dto_1.LoginUserDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "loginEmail", null);
__decorate([
    (0, auth_decorators_1.signupGoogle)(),
    (0, common_1.Get)('/signup/google'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('google')),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [oauth_user_dto_1.OauthUserDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signupGoogle", null);
__decorate([
    (0, auth_decorators_1.loginGoogle)(),
    (0, common_1.Get)('/login/google'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('google')),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [oauth_user_dto_1.OauthUserDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "loginGoogle", null);
__decorate([
    (0, auth_decorators_1.signupNaver)(),
    (0, common_1.Get)('/signup/naver'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('naver')),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [oauth_user_dto_1.OauthUserDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signupNaver", null);
__decorate([
    (0, auth_decorators_1.loginNaver)(),
    (0, common_1.Get)('/login/naver'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('naver')),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [oauth_user_dto_1.OauthUserDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "loginNaver", null);
__decorate([
    (0, auth_decorators_1.signupKakao)(),
    (0, common_1.Get)('/signup/kakao'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('kakao')),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [oauth_user_dto_1.OauthUserDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signupKakao", null);
__decorate([
    (0, auth_decorators_1.loginKakao)(),
    (0, common_1.Get)('/login/naver'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('kakao')),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [oauth_user_dto_1.OauthUserDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "loginKakao", null);
__decorate([
    (0, common_1.UseGuards)(auth_guards_1.AuthRefreshGuard),
    (0, auth_decorators_1.restoreAccessToken)(),
    (0, common_1.Post)('/restore-access-token'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "restoreAccessToken", null);
AuthController = __decorate([
    (0, swagger_1.ApiTags)('Auth'),
    (0, common_1.Controller)('/'),
    __metadata("design:paramtypes", [user_profile_service_1.UserProfileService,
        auth_service_1.AuthService])
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map