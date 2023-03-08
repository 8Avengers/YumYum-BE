import { Controller, Post, Body, ValidationPipe, Param, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';

import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from './entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { AuthAccessGuard } from '../auth/guards/auth.guards';

@Controller('/')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/signUp')
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

  @Get('users/:id')
  async view(@Param('id') id: string) {
    const user = await this.userService.getUserById(id);
    return user;
  }

  


  @Get('/user')
  @UseGuards(AuthAccessGuard)
  // @UseGuards(AuthGuard())  
 async user(@CurrentUser() user: User ) {
    return user;
  }

}
