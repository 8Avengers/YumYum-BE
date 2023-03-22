import { ApiTags } from '@nestjs/swagger';
import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UserSignupService } from './user-signup.service';

@ApiTags('회원가입')
@Controller('/')
export class UserSignupController {
  constructor(private readonly userSignupService: UserSignupService) {}

  @Post('/signup')
  async signUp(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    try {
      const { email, password, nickname, name, gender, birth, phoneNumber } =
        createUserDto;
      console.log(createUserDto);

      const hashedPassword = await bcrypt.hash(password, 12);

      const response = await this.userSignupService.createLocalUser({
        email,
        hashedPassword,
        nickname,
        name,
        gender,
        birth,
        phoneNumber,
      });

      return { message: '회원가입이 성공했습니다.' };
    } catch (error) {
      return { error: error.message };
    }
  }
}
