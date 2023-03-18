import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class DeleteUserDto {
  @ApiProperty({
    example: 'Abcd1234!',
    description: 'password',
    required: true,
  })
  @MinLength(8, { message: '비밀번호는 최소 8글자입니다.' })
  @MaxLength(20, { message: '비밀번호는 최대 20글자입니다.' })
  @IsString({ message: '비밀번호는 문자열 형식이여야 합니다' })
  @IsNotEmpty({ message: '비밀번호를 입력해주세요.' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*]).{8,20}$/, {
    message:
      '비밀번호는 대문자, 소문자 및 특수 문자를 포함하여 8자 이상 20자이하여야 합니다.',
  })
  readonly password: string;
}
