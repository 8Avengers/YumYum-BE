import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserSignupService } from '../user/user-signup.service';

//passport미사용
import { SocialLoginBodyDTO } from './dto/social-login.dto';
import { SocialGoogleService } from './social-google.service';

import { SocialKakaoService } from './social-kakao.service';
import { SocialNaverService } from './social-naver.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService, //
    private readonly configService: ConfigService,
    private readonly userSignupService: UserSignupService,

    //passport미사용에 필요한 DI
    private socialKaKaoService: SocialKakaoService,
    private socialNaverService: SocialNaverService,
    private readonly socialGoogleService: SocialGoogleService,
  ) {}

  //구글로그인-Passport미사용
  async oauthLoginGoogle(
    provider: 'google', //
    body: SocialLoginBodyDTO,
  ) {
    const socialService = this.socialGoogleService;

    console.log('provider에는 뭐가들어올까아?', provider);
    console.log('body에는 뭐가들어올까아?', body);

    const token = await socialService.getOauth2Token(body); //body안에는 code와 state가 들어있어.
    const info = await socialService.getUserInfo(token.access_token);

    console.log('token에는 뭐가 들어가 있을까?', token);
    console.log('info에는 뭐가 들어가 있을까?', info);

    console.log('getUserInfo통과후info.email', info.email);
    console.log('getUserInfo통과후info.nickname', info.name);
    console.log(
      'getUserInfo통과후info.fullname',
      info.family_name + info.given_name,
    );

    let user; // 먼저 유저 정의

    try {
      /* 
      구글 API로 부터 응답받은
      어카운트 이메일, 
      어카운트 닉네임을 
      내가정의한 변수로 담는다.
      */
      const providerIdFromGoogle = info.sub;
      const userEmailFromGoogle = info.email;
      const userNicknameFromGoogle = info.name;

      console.log('useridFromGoogle info.id 통과', providerIdFromGoogle);
      console.log('userEmailFromGoogle통과', userEmailFromGoogle);
      console.log('userNicknameFromGoogle통과', userNicknameFromGoogle);

      // 1. 가입확인
      const existingUser = await this.userSignupService.findOne({
        email: userEmailFromGoogle,
      });
      // 2. 존재하는 유저가 없으면, 회원가입 후 바로 로그인
      if (!existingUser) {
        user = await this.userSignupService.createOauthUser({
          email: userEmailFromGoogle,
          nickname: userNicknameFromGoogle,
          name: info.name,
          provider: provider,
          provider_id: providerIdFromGoogle,
        });
      } else {
        user = existingUser; // 가입이미되어있다면, 로그인 진행
      }
      console.log('가입이미되어있다면, 로그인 진행의 user', user);

      user = await this.userSignupService.findOne({
        email: user.email,
      });

      console.log('DB에서 email : user.email이후의 user', user);
    } catch (error) {
      if (error instanceof ConflictException) {
        console.error(`Error:  ${error.message}`);
      } else {
        throw error;
      }
    }

    console.log('try catch문 통과한 이후의 user', user);

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

  //카카오|네이버 로그인-Passport미사용
  async oauthLoginSocial(
    provider: 'kakao' | 'naver',
    body: SocialLoginBodyDTO,
  ) {
    const socialService =
      provider === 'kakao' ? this.socialKaKaoService : this.socialNaverService;
    const token = await socialService.getOauth2Token(body); //body안에는 code와 state가 들어있어.
    const info = await socialService.getUserInfo(token.access_token);

    console.log(
      'socialService 통과후 body',
      body,
      'socialService 통과후 provider',
      provider,
    );

    let user; // 먼저 유저 정의

    if (provider === 'kakao') {
      try {
        // KAKAO API로 부터 응답받은 카카오 어카운트 이메일, 카카오어카운트 닉네임을 내가정의한 변수로 담는다.
        console.log('body 확인', body, 'provider 확인', provider);

        console.log('token에는 뭐가 들어가 있을까?', token);
        console.log('info에는 뭐가 들어가 있을까?', info);
        console.log('info에는 뭐가 들어가 있을까?', provider);

        console.log('getUserInfo통과후info.email', info.email);
        console.log('getUserInfo통과후info.nickname', info.nickname);
        console.log('getUserInfo통과후info.name', info.name);

        const providerIdFromKakao = info.id;
        const userEmailFromKakao = info.kakao_account.email;
        const userNicknameFromKakao = info.kakao_account.profile.nickname;

        console.log('useridFromKakao info.id 통과', providerIdFromKakao);
        console.log('userEmailFromKakao통과', userEmailFromKakao);
        console.log('userNicknameFromKakao통과', userEmailFromKakao);

        // 1. 가입확인
        const existingUser = await this.userSignupService.findOne({
          email: userEmailFromKakao,
        });
        // 2. 존재하는 유저가 없으면, 회원가입 후 바로 로그인
        if (!existingUser) {
          user = await this.userSignupService.createOauthUser({
            email: userEmailFromKakao,
            nickname: userNicknameFromKakao,
            name: info.name, // 카카오는 이름이 없음
            provider: provider,
            provider_id: providerIdFromKakao,
          });
        } else {
          user = existingUser; // 가입이미되어있다면, 로그인 진행
        }
        // console.log('가입이미되어있다면, 로그인 진행의 user', user);

        user = await this.userSignupService.findOne({
          email: user.email,
        });

        // console.log('DB에서 email : user.email이후의 user', user);
      } catch (error) {
        if (error instanceof ConflictException) {
          console.error(`Error:  ${error.message}`);
        } else {
          throw error;
        }
      }
    } else if (provider === 'naver') {
      console.log('body 확인', body, 'provider 확인', provider);

      const providerIdFromNaver = info.id;
      const userEmailFromNaver = info.email;
      const userNicknameFromNaver = info.nickname;

      console.log('useridFromNaver response.id passed', providerIdFromNaver);
      console.log('userEmailFromNaver passed', userEmailFromNaver);
      console.log('passed userNicknameFromNaver', userNicknameFromNaver);
      console.log('info', info);
      console.log('provider', provider);

      try {
        const existingUser = await this.userSignupService.findOne({
          email: userEmailFromNaver,
        });

        if (!existingUser) {
          user = await this.userSignupService.createOauthUser({
            email: userEmailFromNaver,
            nickname: userNicknameFromNaver,
            name: info.name,
            provider: provider,
            provider_id: providerIdFromNaver,
          });
        } else {
          user = existingUser;
        }

        user = await this.userSignupService.findOne({
          email: user.email,
        });
      } catch (error) {
        if (error instanceof ConflictException) {
          console.error(`Error: ${error.message}`);
        } else {
          throw error;
        }
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
        user = await this.userSignupService.createUserWithPassport({
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
