import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiOAuth2,
} from '@nestjs/swagger';
import { UpdateUserProfileResponseDto } from './dto/update-user-response.dto';
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

export const UpdateUserProfile = () => {
  return applyDecorators(
    ApiOperation({ summary: '유저 프로필 정보 수정' }),
    ApiResponse({
      status: 200,
      description: '유저 프로필 정보 수정 성공',
      type: UpdateUserProfileResponseDto,
    }),
    ApiResponse({ status: 400, description: '유저 프로필 정보 수정 실패' }),
  );
};

export const DeleteUser = () => {
  return applyDecorators(
    ApiOperation({ summary: '유저 탈퇴 - 소프트딜리트' }),
    ApiResponse({ status: 200, description: '유저 탈퇴 - 소프트딜리트 성공' }),
    ApiResponse({ status: 400, description: '유저 탈퇴 - 소프트딜리트 실패' }),
  );
};
