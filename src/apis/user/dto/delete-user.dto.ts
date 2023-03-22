import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class DeleteUserDto {
  @ApiProperty({
    example: 'Abcd1234!',
    description: 'password',
    required: true,
  })
  @IsNotEmpty({ message: '비밀번호를 입력해주세요.' })
  readonly password: string;
}
