import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiOAuth2,
} from '@nestjs/swagger';
import { UserDto } from './dto/user.dto';

//TODO: 카카오 회원가입시 로그인 시 request 어떻게 할까?
//TODO:구글 회원가입시 로그인 시 request 어떻게 할까?
//TODO:네이버 회원가입시 로그인 시 request 어떻게 할까?

export const signUpEmail = () => {
  return applyDecorators(
    ApiOperation({ summary: '이메일회원가입' }),
    ApiResponse({
      status: 201,
      description: '이메일회원가입 성공',
      type: UserDto,
    }),
    ApiResponse({ status: 400, description: '이메일회원가입 실패' }),
    ApiResponse({
      status: 500,
      description: 'Server Error',
    }),
  );
};
