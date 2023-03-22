import { IntersectionType, PickType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, IsIn } from 'class-validator';

export class SocialLoginProviderDTO {
  @IsIn(['kakao', 'naver'], {
    message: '소셜 로그인은 kakao와 naver만 지원합니다.',
  })
  provider: 'kakao' | 'naver';
}

export class SocialLoginBodyDTO {
  @IsNotEmpty({
    message: 'code는 비어있으면 안 됩니다.',
  })
  @IsString({
    message: 'code는 문자열이어야 합니다.',
  })
  code: string;
  @IsOptional()
  @IsString({
    message: 'state는 문자열이어야 합니다.',
  })
  state?: string;
}
