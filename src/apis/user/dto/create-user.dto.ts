import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: '장승윤',
    description: 'name',
  })
  @Matches(/^[가-힣]{2,8}$/, {
    message: '실명은 한글로 입력해주세요',
  })
  @IsString({ message: '이름은 문자열 형식이여야 합니다.' })
  readonly name: string;

  @ApiProperty({
    example: 'email@naver.com',
    description: 'email',
  })
  @IsEmail()
  @IsNotEmpty({ message: 'email을 입력해주세요.' })
  readonly email: string;

  @ApiProperty({
    example: 'Abcd1234!',
    description: 'password',
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

  @ApiProperty({
    example: 'Abcd1234!',
    description: 'confrimPassword',
  })
  @MinLength(8, { message: '확인 비밀번호는 최소 8글자입니다.' })
  @MaxLength(20, { message: '확인 비밀번호는 최대 20글자입니다.' })
  @IsString({ message: '확인 비밀번호는 문자열 형식이여야 합니다' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])/, {
    message:
      '확인 비밀번호는 대문자, 소문자 및 특수 문자를 포함하여 8자 이상 20자이하여야 합니다.',
  })
  readonly confirmPassword: string;
  //TODO: Front에서 회원가입시 비밀번호 와 비밀번호확인

  //TODO: 세준님의 개선사항
  @ApiProperty({
    example: '승윤승윤123',
    description: 'nickanme',
  })
  @IsString({ message: '닉네임은 문자열 형식이여야 합니다.' })
  @MinLength(2, { message: '닉네임은 최소 2글자 입니다.' })
  @MaxLength(10, { message: '닉네임은 최대 10글자 입니다.' })
  readonly nickname: string;

  @ApiProperty({
    example: '01072721789',
    description: 'phoneNumber',
  })
  //TODO: 회원가입시 나중에 휴대폰인증으로 바꾸자.
  @Matches(/^010\d{4}\d{4}$/, {
    message: '01012341234형식을 맞춰주세요. 하이픈을 제거해주세요.',
  })
  readonly phoneNumber: string;

  @ApiProperty({
    example: 'M',
    description: 'gender M or F 이넘으로 데이터베이스에 들어옵니다!',
  })
  @IsEnum(['M', 'F'])
  gender: 'M' | 'F';

  @ApiProperty({
    example: '19920913',
    description:
      'birth라서 920913은 DB에서 에러가 납니다. 19920913 또는 1992-09-13 이렇게는 DB에서 입력받을 수 있습니다.',
  })
  @IsDateString()
  birth: Date;
}
