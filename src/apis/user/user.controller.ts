import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UseGuards,
  Param,
  Get,
} from '@nestjs/common';
import { UserService } from './user.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { AuthAccessGuard } from '../auth/guards/auth.guards';
import { User } from './entities/user.entity';
import { UserDto } from './dto/user.dto';

@ApiTags('User')
@Controller('/')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: '이메일회원가입' })
  @ApiResponse({
    status: 201,
    description: '성공',
    //response할때 dto를 만들면된다.
    type: UserDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Server Error',
  })
  @ApiResponse({
    status: 400,
    description: '요청이 올바르지 않아요',
  })
  @Post('/signup')
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

  @ApiOperation({ summary: '나의프로필페이지' })
  @Get('/me')
  @UseGuards(AuthAccessGuard)
  async me(@CurrentUser() user: User) {
    return user;
  }

  @ApiOperation({ summary: '사람들의 프로필페이지' })
  @Get('/:id')
  async view(@Param('id') id: string) {
    const user = await this.userService.getUserById(id);
    return user;
  }
}
