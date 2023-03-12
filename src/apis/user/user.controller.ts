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
import { signUpEmail } from './user.decorators';

@ApiTags('User')
@Controller('/')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @signUpEmail()
  @Post('/signup')
  async signUpEmail(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    const { email, password, nickname, name, gender, birth, phoneNumber } =
      createUserDto;
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
