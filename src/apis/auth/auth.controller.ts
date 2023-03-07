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
import { AuthAccessGuard, AuthRefreshGuard } from './guards/auth.guards';
import { CurrentUser } from 'src/common/decorators/crrunet-user.decorator';
import { UserService } from '../user/user.service';
import { LoginUserDto } from '../user/dto/login-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../user/entities/user.entity';
import { Response } from 'express';

interface IOAuthUser {
  user: Pick<User, 'email' | 'password' | 'name' | 'gender' | 'birth'>;
}

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
    // @Res() res, // res 를 써주지 않으면 무한로딩한다.
  ) {
    const { email, password } = loginUserDto;
    const user = await this.userService.findOne({ email });

    if (!user)
      throw new UnprocessableEntityException(' 등록된 이메일이 없습니다.');

    const isAuth = await bcrypt.compare(password, user.password);
    if (!isAuth)
      throw new UnprocessableEntityException('비밀번호가 일치하지 않습니다.');

    const accessToken = this.authService.createAccessToken({
      user,
    });
    const refreshToken = this.authService.createRefreshToken({ user });

    return {
      refreshToken,
      accessToken,
    };
  }

  //AccessToken 재발급 API
  @UseGuards(AuthAccessGuard)
  @Post('restoreAccessToken')
  async restoreAccessToken(
    // @Req() req,//
    @CurrentUser() currentUser: any, //
  ) {
    console.log('currentUser::::::::::::::::::::', currentUser);

    return this.authService.createAccessToken({ user: currentUser });
  }

  //구글로그인
  @Get('/login/google')
  @UseGuards(AuthGuard('google'))
  async loginGoogle(
    @Req() req: Request & IOAuthUser, //
    @Res() res: Response,
  ) {
    this.authService.loginOauth({ req, res });
  }

  //네이버로그인
  @Get('/login/naver')
  @UseGuards(AuthGuard('naver'))
  async loginNaver(
    @Req() req: Request & IOAuthUser, //
    @Res() res: Response,
  ) {
    this.authService.loginOauth({ req, res });
  }

  //카카오로그인
  @Get('/login/kakao')
  @UseGuards(AuthGuard('kakao'))
  async loginKakao(
    @Req() req: Request & IOAuthUser, //
    @Res() res: Response,
  ) {
    // 1. 가입확인
    this.authService.loginOauth({ req, res });
  }
}

// // @Res()res
// //로그아웃 API 쿠키는 프론트에서 지우면된다.

// @Post('logout')
// async logout(@Res() res) {
//   return 'ok';

//   // try {
//   //   console.log(res.clearCookie); //[Function: clearCookie]

//   //   res.clearCookie('refreshToken');
//   //   console.log('여긴가 2번');

//   //   // console.log('res 쿠키 사라졌나 확인해보자', res);
//   //   console.log('okays');

//   //   return { message: '로그아웃이 성공했습니다.' };
//   // } catch (error) {
//   //   console.log('여긴가 3번');

//   //   console.log(error);

//   //   throw error;
//   // }
