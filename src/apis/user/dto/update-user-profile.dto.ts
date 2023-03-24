import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateUserProfileDto {
  @ApiProperty({
    description: 'name',
    required: true,
  })
  @IsString({ message: '닉네임은 문자열로 입력해주세요.' })
  name: string;

  @ApiProperty({
    example: '승윤123',
    description: 'nickanme',
    required: true,
  })
  @IsString({ message: '닉네임은 문자열로 입력해주세요.' })
  @MinLength(2, { message: '닉네임은 최소 2글자 입니다.' })
  @MaxLength(10, { message: '닉네임은 최대 10글자 입니다.' })
  nickname: string;

  //TODO: 자기소개글 최대 몇자로해야할까?
  @ApiProperty({
    example: '이것은 나의 소개를 입력하는 곳입니다.',
    description: '소개',
  })
  @IsOptional()
  @IsString({ message: '소개는 문자열로 입력해주세요.' })
  @MaxLength(100, {
    message: '자기소개는 최대 100글자까지 입력할 수 있습니다.',
  })
  introduce?: string;

  //TODO: 미 입력시 기본이미지로 업로드되도록 할 수 있을까?
  @ApiProperty({
    example: 'profileImage',
    description: 'Profile Image',
    // required: true,
  })
  @IsString({ message: 'Profile Image must be a string.' })
  @IsOptional()
  profileImage?: string;
}
