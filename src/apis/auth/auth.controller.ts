import {
  Controller,
  Post,
  Body,
  Req,
  Res,
  UseGuards,
  Get,
} from '@nestjs/common';
import { UnprocessableEntityException } from '@nestjs/common';
import { AuthService } from './auth.service';
import * as bcrypt from 'bcrypt';
import { ValidationPipe } from '@nestjs/common';
import { AuthRefreshGuard } from './guards/auth.guards';
import { CurrentUser } from 'src/common/decorators/crrunet-user.decorator';
import { UserService } from '../user/user.service';
import { LoginUserDto } from '../user/dto/login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('login')
  async login(
    @Body(ValidationPipe) loginUserDto: LoginUserDto, //
    @Req() req, //
    @Res() res, //
  ) {
    const { email, password } = loginUserDto;
    console.log('로그인시 email이 들어오는지 찍어보자', email);
    console.log('로그인시 password가 들어오는지 찍어보자', password);

    const user = await this.userService.findOne({ email });
    console.log('로그인시 user가있는지 확인해보자!', user);

    if (!user)
      throw new UnprocessableEntityException(' 등록된 이메일이 없습니다.');

    const isAuth = await bcrypt.compare(password, user.password);
    if (!isAuth)
      throw new UnprocessableEntityException('비밀번호가 일치하지 않습니다.');

    this.authService.createRefreshToken({ user, res });

    return this.authService.createAccessToken({ user });
  }

  // @Res()res

  @Post('logout')
  async logout(@Res() response) {
    return 'ok';

    // try {
    //   console.log(res.clearCookie); //[Function: clearCookie]

    //   res.clearCookie('refreshToken');
    //   console.log('여긴가 2번');

    //   // console.log('res 쿠키 사라졌나 확인해보자', res);
    //   console.log('okays');

    //   return { message: '로그아웃이 성공했습니다.' };
    // } catch (error) {
    //   console.log('여긴가 3번');

    //   console.log(error);

    //   throw error;
    // }
  }

  @UseGuards(AuthRefreshGuard)
  @Post('restoreAccessToken')
  async restoreAccessToken(
    // @Req() req,//
    @CurrentUser() currentUser: any, //
  ) {
    console.log('currentUser::::::::::::::::::::', currentUser);

    return this.authService.createAccessToken({ user: currentUser });
  }
}
