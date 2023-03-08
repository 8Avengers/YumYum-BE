import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('auth')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signUp')
  async signUp(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    const {
      email,
      password,
      nickname,
      name,
      gender,
      birth,
      phoneNumber,
      profileImage,
    } = createUserDto;
    console.log(createUserDto);

    const hashedPassword = await bcrypt.hash(password, 12);

    return this.userService.createUser({
      email,
      hashedPassword,
      nickname,
      name,
      gender,
      birth,
      phoneNumber,
      profileImage,
    });
  }
}
