import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UpdateUserProfileResponseDto {
  @ApiProperty({
    example: '최강8조',
    description: '닉네임',
  })
  nickname: string;

  @ApiProperty({
    example: '최강8조',
    description: '소개',
  })
  @IsOptional()
  introduce?: string;

  @ApiProperty({
    example: 'yumyumdb/1678810993996_KakaoTalk_20230305_231238341_06.jpg',
    description: '프로필이미지',
  })
  @IsOptional()
  profile_image?: string;
}
