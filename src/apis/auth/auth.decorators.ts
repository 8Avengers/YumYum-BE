import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiOperation,
  ApiResponse,
  ApiHeader,
  ApiBearerAuth,
  ApiOAuth2,
} from '@nestjs/swagger';
import { LoginUserDto } from '../user/dto/login-user.dto';

//TODO: 카카오 회원가입시 로그인 시 request 어떻게 할까?
//TODO:구글 회원가입시 로그인 시 request 어떻게 할까?
//TODO:네이버 회원가입시 로그인 시 request 어떻게 할까?

export const loginEmail = () => {
  return applyDecorators(
    ApiOperation({ summary: '이메일로그인' }),
    ApiResponse({
      status: 201,
      description: '회원가입 성공',
      type: LoginUserDto,
    }),
    ApiResponse({ status: 400, description: '회원가입 실패' }),
    ApiResponse({
      status: 500,
      description: 'Server Error',
    }),
  );
};

export const signupGoogle = () => {
  return applyDecorators(
    ApiOperation({ summary: '구글회원가입' }),

    ApiResponse({ status: 201, description: '구글회원가입 성공' }),
    ApiResponse({ status: 400, description: '구글회원가입 실패' }),
    ApiResponse({
      status: 500,
      description: 'Server Error',
    }),
  );
};

export const loginGoogle = () => {
  return applyDecorators(
    ApiOperation({ summary: '구글로그인' }),

    ApiResponse({ status: 201, description: '구글로그인 성공' }),
    ApiResponse({ status: 400, description: '구글로그인 실패' }),
    ApiResponse({
      status: 500,
      description: 'Server Error',
    }),
  );
};

export const signupNaver = () => {
  return applyDecorators(
    ApiOperation({ summary: '네이버회원가입' }),

    ApiResponse({ status: 201, description: '네이버회원가입 성공' }),
    ApiResponse({ status: 400, description: '네이버회원가입 실패' }),
    ApiResponse({
      status: 500,
      description: 'Server Error',
    }),
  );
};

export const loginNaver = () => {
  return applyDecorators(
    ApiOperation({ summary: '네이버로그인' }),

    ApiResponse({ status: 201, description: '네이버로그인 성공' }),
    ApiResponse({ status: 400, description: '네이버로그인 실패' }),
    ApiResponse({
      status: 500,
      description: 'Server Error',
    }),
  );
};

export const signupKakao = () => {
  return applyDecorators(
    ApiOperation({ summary: '카카오로그인' }),
    ApiResponse({ status: 201, description: '카카오로그인 성공' }),
    ApiResponse({ status: 400, description: '카카오로그인 실패' }),
    ApiResponse({
      status: 500,
      description: 'Server Error',
    }),
    ApiOAuth2(['kakao'], 'kakao'), // TODO : 스웨거에서 되는지 확인 후 수정 필요
    UseGuards(AuthGuard('kakao')),
  );
};

export const loginKakao = () => {
  return applyDecorators(
    ApiOperation({ summary: '카카오로그인' }),
    ApiResponse({ status: 201, description: '카카오로그인 성공' }),
    ApiResponse({ status: 400, description: '카카오로그인 실패' }),
    ApiResponse({
      status: 500,
      description: 'Server Error',
    }),
    ApiOAuth2(['kakao'], 'kakao'), // TODO : 스웨거에서 되는지 확인 후 수정 필요
    UseGuards(AuthGuard('kakao')),
  );
};

export const restoreAccessToken = () => {
  return applyDecorators(
    ApiOperation({ summary: '액세스토큰만료시 재발행' }),
    ApiBearerAuth('refreshToken'), //이게 리프레시토큰이 필요하기에 쓴건가요?
    ApiResponse({ status: 201, description: '토큰 재발급 성공' }),
    ApiResponse({ status: 400, description: '토큰 재발급 실패' }),
    ApiResponse({
      status: 500,
      description: 'Server Error',
    }),
  );
};

export const Logout = () => {
  return applyDecorators(
    ApiOperation({ summary: '로그아웃' }),
    ApiBearerAuth('refreshToken'),
    ApiResponse({ status: 201, description: '로그아웃 성공' }),
    ApiResponse({ status: 400, description: '로그아웃 실패' }),
    ApiResponse({
      status: 500,
      description: 'Server Error',
    }),
  );
};
