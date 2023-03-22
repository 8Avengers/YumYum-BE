import { ConflictException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserSignupService } from '../user/user-signup.service';

//passport미사용
import { SocialLoginBodyDTO } from './dto/social-login.dto';

import { SocialKakaoService } from './social.kakao.service';
import { SocialNaverService } from './social.naver.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService, //
    private readonly configService: ConfigService,
    private readonly userSignupService: UserSignupService,

    //passport미사용
    private socialKaKaoService: SocialKakaoService,
    private socialNaverService: SocialNaverService,
  ) {}

  //소셜로그인API-Passport미사용
  async oauthLogin(provider: 'kakao' | 'naver', body: SocialLoginBodyDTO) {
    const socialService =
      provider === 'kakao' ? this.socialKaKaoService : this.socialNaverService;

    const token = await socialService.getOauth2Token(body); //body안에는 code와 state가 들어있어.
    const info = await socialService.getUserInfo(token.access_token);

    console.log('token에는 뭐가 들어가 있을까?', token);
    console.log('info에는 뭐가 들어가 있을까?', info);

    // const id = info.id;
    // let nickname =
    //   provider === 'kakao'
    //     ? info.kakao_account.profile.nickname
    //     : info.nickname;

    let user; // Add this line to define the user variable

    try {
      // 1. 가입확인
      const existingUser = await this.userSignupService.findOne({
        email: info.email,
      });

      // 2. 존재하는 유저가 없으면, 회원가입 후 바로 로그인
      if (!existingUser) {
        user = await this.userSignupService.createOauthUser({
          email: info.email,
          nickname: info.nickname,
          name: info.name,
        });
      } else {
        user = existingUser; // 가입이미되어있다면, 로그인 진행
      }
    } catch (error) {
      if (error instanceof ConflictException) {
        console.error(`Error:  ${error.message}`);
      } else {
        throw error;
      }
    }

    // 3. 로그인 : 소셜 로그인했지만, 우리서비스에서 로그인한 것처럼 AT,RT발급
    const accessToken = await this.createAccessToken({ user });
    const refreshToken = await this.createRefreshToken({ user });

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

  //액세스토큰생성
  createAccessToken({ user }) {
    console.log('acessToken의 유저', user);
    const accessToken = this.jwtService.sign(
      {
        email: user.email,
        id: user.id,
        nickname: user.nickname,
        profileImage: user.profile_image,
      },
      {
        secret: this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
        expiresIn: '14d',
      },
    );

    return accessToken;
  }

  //리프레시토큰생성
  createRefreshToken({ user }) {
    console.log('refreshToken의 유저', user);

    const refreshToken = this.jwtService.sign(
      {
        id: user.id,
      },
      {
        secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
        expiresIn: '14d',
      },
    );
    return refreshToken;
  }

  //소셜로그인-Passport 사용
  async loginOauthByPassport({ user }) {
    console.log('oauth 끝나면 나오는 유저찍어보자', user);

    try {
      // 1. 가입확인
      const existingUser = await this.userSignupService.findOne({
        email: user.email,
      });

      // 2. 존재하는 유저가 없으면, 회원가입 후 바로 로그인
      if (!existingUser) {
        user = await this.userSignupService.createOauthUser({
          email: user.email,
          nickname: user.nickname,
          name: user.name,
        });
      }
    } catch (error) {
      if (error instanceof ConflictException) {
        console.error(`Error:  ${error.message}`);
      } else {
        throw error;
      }
    }

    // 3. 로그인 : 소셜 로그인했지만, 우리서비스에서 로그인한 것처럼 AT,RT발급
    const accessToken = await this.createAccessToken({ user });
    const refreshToken = await this.createRefreshToken({ user });

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
}
