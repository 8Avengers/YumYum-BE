"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logout = exports.restoreAccessToken = exports.loginKakao = exports.signupKakao = exports.loginNaver = exports.signupNaver = exports.loginGoogle = exports.signupGoogle = exports.loginEmail = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const swagger_1 = require("@nestjs/swagger");
const loginEmail = () => {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: '이메일로그인' }), (0, swagger_1.ApiResponse)({
        status: 201,
        description: '이메일로그인 성공',
    }), (0, swagger_1.ApiResponse)({ status: 400, description: '이메일로그인 실패' }), (0, swagger_1.ApiResponse)({
        status: 500,
        description: 'Server Error',
    }));
};
exports.loginEmail = loginEmail;
const signupGoogle = () => {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: '구글회원가입' }), (0, swagger_1.ApiResponse)({ status: 201, description: '구글회원가입 성공' }), (0, swagger_1.ApiResponse)({ status: 400, description: '구글회원가입 실패' }), (0, swagger_1.ApiResponse)({
        status: 500,
        description: 'Server Error',
    }));
};
exports.signupGoogle = signupGoogle;
const loginGoogle = () => {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: '구글로그인' }), (0, swagger_1.ApiResponse)({ status: 201, description: '구글로그인 성공' }), (0, swagger_1.ApiResponse)({ status: 400, description: '구글로그인 실패' }), (0, swagger_1.ApiResponse)({
        status: 500,
        description: 'Server Error',
    }));
};
exports.loginGoogle = loginGoogle;
const signupNaver = () => {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: '네이버회원가입' }), (0, swagger_1.ApiResponse)({ status: 201, description: '네이버회원가입 성공' }), (0, swagger_1.ApiResponse)({ status: 400, description: '네이버회원가입 실패' }), (0, swagger_1.ApiResponse)({
        status: 500,
        description: 'Server Error',
    }));
};
exports.signupNaver = signupNaver;
const loginNaver = () => {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: '네이버로그인' }), (0, swagger_1.ApiResponse)({ status: 201, description: '네이버로그인 성공' }), (0, swagger_1.ApiResponse)({ status: 400, description: '네이버로그인 실패' }), (0, swagger_1.ApiResponse)({
        status: 500,
        description: 'Server Error',
    }));
};
exports.loginNaver = loginNaver;
const signupKakao = () => {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: '카카오로그인' }), (0, swagger_1.ApiResponse)({ status: 201, description: '카카오로그인 성공' }), (0, swagger_1.ApiResponse)({ status: 400, description: '카카오로그인 실패' }), (0, swagger_1.ApiResponse)({
        status: 500,
        description: 'Server Error',
    }), (0, swagger_1.ApiOAuth2)(['kakao'], 'kakao'), (0, common_1.UseGuards)((0, passport_1.AuthGuard)('kakao')));
};
exports.signupKakao = signupKakao;
const loginKakao = () => {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: '카카오로그인' }), (0, swagger_1.ApiResponse)({ status: 201, description: '카카오로그인 성공' }), (0, swagger_1.ApiResponse)({ status: 400, description: '카카오로그인 실패' }), (0, swagger_1.ApiResponse)({
        status: 500,
        description: 'Server Error',
    }), (0, swagger_1.ApiOAuth2)(['kakao'], 'kakao'), (0, common_1.UseGuards)((0, passport_1.AuthGuard)('kakao')));
};
exports.loginKakao = loginKakao;
const restoreAccessToken = () => {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: '액세스토큰만료시 재발행' }), (0, swagger_1.ApiBearerAuth)('refreshToken'), (0, swagger_1.ApiResponse)({ status: 201, description: '토큰 재발급 성공' }), (0, swagger_1.ApiResponse)({ status: 400, description: '토큰 재발급 실패' }), (0, swagger_1.ApiResponse)({
        status: 500,
        description: 'Server Error',
    }));
};
exports.restoreAccessToken = restoreAccessToken;
const Logout = () => {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: '로그아웃' }), (0, swagger_1.ApiBearerAuth)('refreshToken'), (0, swagger_1.ApiResponse)({ status: 201, description: '로그아웃 성공' }), (0, swagger_1.ApiResponse)({ status: 400, description: '로그아웃 실패' }), (0, swagger_1.ApiResponse)({
        status: 500,
        description: 'Server Error',
    }));
};
exports.Logout = Logout;
//# sourceMappingURL=auth.decorators.js.map