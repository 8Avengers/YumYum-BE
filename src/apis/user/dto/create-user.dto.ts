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
  @IsNotEmpty()
  @Matches(/^[가-힣]{2,8}$/, {
    message: '실명은 한글로 입력해주세요',
  })
  @IsString({ message: '이름은 문자열 형식이여야 합니다.' })
  readonly name: string;

  @IsEmail()
  @IsNotEmpty({ message: 'email을 입력해주세요.' })
  readonly email: string;

  @MinLength(8, { message: '비밀번호는 최소 8글자입니다.' })
  @MaxLength(20, { message: '비밀번호는 최대 20글자입니다.' })
  @IsString({ message: '비밀번호는 문자열 형식이여야 합니다' })
  @IsNotEmpty({ message: '비밀번호를 입력해주세요.' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*]).{8,20}$/, {
    message:
      '비밀번호는 대문자, 소문자 및 특수 문자를 포함하여 8자 이상 20자이하여야 합니다.',
  })
  readonly password: string;

  @MinLength(8, { message: '확인 비밀번호는 최소 8글자입니다.' })
  @MaxLength(20, { message: '확인 비밀번호는 최대 20글자입니다.' })
  @IsString({ message: '확인 비밀번호는 문자열 형식이여야 합니다' })
  @IsNotEmpty({ message: '확인 비밀번호를 입력해주세요.' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])/, {
    message:
      '확인 비밀번호는 대문자, 소문자 및 특수 문자를 포함하여 8자 이상 20자이하여야 합니다.',
  })
  readonly confirmPassword: string;
  //TODO: Front에서 회원가입시 비밀번호 와 비밀번호확인

  @IsNotEmpty({ message: '닉네임을 입력헤주세요' })
  @IsString({ message: '닉네임은 문자열 형식이여야 합니다.' })
  @MaxLength(20, { message: '닉네임은 최대 20글자 입니다.' })
  @Matches(/^[가-힣a-z0-9A-Z]{4,20}$/, {
    message: '닉네임은 한글 또는 숫자 또는 영문으로 입력해주세요',
  })
  @IsNotEmpty()
  readonly nickname: string;

  //TODO: 회원가입시 나중에 휴대폰인증으로 바꾸자.
  @IsNotEmpty()
  @Matches(/^010\d{4}\d{4}$/, {
    message: '01012341234형식을 맞춰주세요. 하이픈을 제거해주세요.',
  })
  readonly phoneNumber: string;

  //TODO: 회원가입시 성별 입력값을 어떻게 받을까?
  @IsEnum(['M', 'F'])
  gender: 'M' | 'F';

  //TODO: 회원가입시 birth: 입력값을 어떻게 받을까? 920913은 안된다. 19920913 또는 1992-09-13
  @IsDateString()
  birth: Date;

  //TODO: 회원가입시 profileImage는 Default 이미지를 넣어야 하는데 어떻게 할까
  @IsOptional()
  @IsString()
  profileImage: string;
}
