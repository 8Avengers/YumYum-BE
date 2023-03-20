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
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UserProfileService } from '../user/user-profile.service';
import { LoginUserDto } from '../user/dto/login-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { AuthRefreshGuard } from './guards/auth.guards';
import { OauthUserDto } from '../user/dto/oauth-user.dto';

import {
  loginEmail,
  loginGoogle,
  loginKakao,
  loginNaver,
  restoreAccessToken,
  signupGoogle,
  signupKakao,
  signupNaver,
} from './auth.decorators';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('/')
export class AuthController {
  constructor(
    private readonly userProfileService: UserProfileService,
    private readonly authService: AuthService,
  ) {}

  //TODO: 이미 소셜로그인 완료했는데, 이메일로 또 로그인하려는 경우 에러처리해야한다.
  @loginEmail() //스웨거전용커스텀데코레이터
  @Post('/login')
  async loginEmail(
    @Body(ValidationPipe) loginUserDto: LoginUserDto, //
    // @Req() req, //
    // @Res() res, // res 를 써주지 않으면 무한로딩한다.
  ) {
    const { email, password } = loginUserDto;
    const user = await this.userProfileService.findByEmail({ email });

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
      user: {
        userId: user.id,
        nickname: user.nickname,
        email: user.email,
        profileImage: user.profile_image,
      },
    };
  }

  //구글로그인
  @loginGoogle() //스웨거전용커스텀데코레이터
  @Get('/login/google')
  @UseGuards(AuthGuard('google'))
  async loginGoogle(
    @CurrentUser() user: OauthUserDto, //
  ): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    return this.authService.loginOauth({ user });
  }

  //카카오로그인
  @loginKakao() //스웨거전용커스텀데코레이터
  @Get('/login/kakao')
  @UseGuards(AuthGuard('kakao'))
  async loginKakao(
    @CurrentUser() user: OauthUserDto, //
  ): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    return this.authService.loginOauth({ user });
  }

  //네이버로그인
  @loginNaver() //스웨거전용커스텀데코레이터
  @Get('/login/naver')
  @UseGuards(AuthGuard('naver'))
  async loginNaver(
    @CurrentUser() user: OauthUserDto, //
  ): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    return this.authService.loginOauth({ user });
  }

  @UseGuards(AuthRefreshGuard)
  @restoreAccessToken() //스웨거전용커스텀데코레이터
  @Post('/restore-access-token')
  async restoreAccessToken(
    @CurrentUser() currentUser: any, // @Req() req, // @Request() req,//
  ) {
    const accessToken = this.authService.createAccessToken({
      user: currentUser,
    });
    return { accessToken };
  }
}

// //구글회원가입
// @signupGoogle() //스웨거전용커스텀데코레이터
// @Get('/signup/google')
// @UseGuards(AuthGuard('google'))
// async signupGoogle(
//   @CurrentUser() user: OauthUserDto, //
// ): Promise<{
//   accessToken: string;
//   refreshToken: string;
// }> {
//   return this.authService.signupOauth({ user });
// }

// //네이버회원가입
// @signupNaver() //스웨거전용커스텀데코레이터
// @Get('/signup/naver')
// @UseGuards(AuthGuard('naver'))
// async signupNaver(
//   @CurrentUser() user: OauthUserDto, //
// ): Promise<{
//   accessToken: string;
//   refreshToken: string;
// }> {
//   return this.authService.signupOauth({ user });
// }

// //카카오회원가입
// @signupKakao() //스웨거전용커스텀데코레이터
// @Get('/signup/kakao')
// @UseGuards(AuthGuard('kakao'))
// async signupKakao(
//   @CurrentUser() user: OauthUserDto, //
// ): Promise<{
//   accessToken: string;
//   refreshToken: string;
// }> {
//   return this.authService.signupOauth({ user });
// }
