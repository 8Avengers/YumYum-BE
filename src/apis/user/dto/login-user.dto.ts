import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from "class-validator";


//Dto에 readonly를 쓰는 것이 맞는 것일까?

export class LoginUserDto {
    @IsEmail()
    @IsNotEmpty({message: 'email형식에 맞게 입력해주세요.'})
    readonly email: string;

    @MinLength(8)
    @MaxLength(20)
    @IsString({ message: '비밀번호는 문자열 형식이여야 합니다' })
    @IsNotEmpty({message: '비밀번호를 입력해주세요.'})
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])/,    {
        message: '비밀번호는 대문자, 소문자 및 특수 문자를 포함하여 8자 이상 20자이하여야 합니다.',
      })
    readonly password: string;
}