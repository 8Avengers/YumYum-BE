import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateUserProfileDto {
  @ApiProperty({
    example: '승윤123',
    description: 'nickanme',
    required: true,
  })
  @IsOptional({ message: '닉네임을 최소2자 최대 10글자를 입력해주세요.' })
  @IsString({ message: '닉네임은 문자열로 입력해주세요.' })
  @MinLength(2, { message: '닉네임은 최소 2글자 입니다.' })
  @MaxLength(10, { message: '닉네임은 최대 10글자 입니다.' })
  nickname?: string;

  @ApiProperty({
    example: '이것은 나의 소개를 입력하는 곳입니다.',
    description: '소개',
  })
  @IsOptional()
  @IsString({ message: '소개는 문자열로 입력해주세요.' })
  introduce?: string;

  @ApiProperty({
    example: 'profielImage',
    description: '프로필이미지',
  })
  // @IsString()
  profileImage: string;

  // @ApiProperty({ example: 'img', description: '프로필 이미지', required: true })
  // @IsString()
  // profileImage: string = 'img';
}
