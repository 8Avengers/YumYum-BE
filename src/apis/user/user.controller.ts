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

@Controller('/')
export class UserController {
  constructor(private readonly userService: UserService) {}

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

  @Get('/me')
  @UseGuards(AuthAccessGuard)
  async me(@CurrentUser() user: User) {
    return user;
  }
  @Get('/:id')
  async view(@Param('id') id: string) {
    const user = await this.userService.getUserById(id);
    return user;
  }
}
