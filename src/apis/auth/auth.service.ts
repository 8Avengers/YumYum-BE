import { ConflictException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService, //
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {}

  //액세스토큰생성
  createAccessToken({ user }) {
    console.log('acessToken의 유저', user);
    const accessToken = this.jwtService.sign(
      { email: user.email, id: user.id, profileImage: user.profile_image }, //
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
      { email: user.email, id: user.id, profileImage: user.profile_image },
      {
        secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
        expiresIn: '14d',
      },
    );
    return refreshToken;
  }

  //소셜회원가입 API
  async signupOauth({ user }) {
    console.log('oauth 끝나면 나오는 유저찍어보자', user);

    // 1. 가입확인
    let existingUser = await this.userService.findOne({
      email: user.email,
    });

    if (existingUser)
      throw new ConflictException(
        '이미 등록된 이메일입니다. 소셜로그인해주세요.',
      );

    try {
      // 2. 회원가입
      if (!existingUser) {
        user = await this.userService.createOauthUser({
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

    // 3. 로그인
    const accessToken = await this.createAccessToken({ user });
    const refreshToken = await this.createRefreshToken({ user });

    return {
      refreshToken,
      accessToken,
    };
  }

  //소셜로그인 API
  async loginOauth({ user }) {
    console.log('oauth 끝나면 나오는 유저찍어보자', user);

    try {
      // 1. 가입확인
      let existingUser = await this.userService.findOne({
        email: user.email,
      });

      // 2. 존재하는 유저가 없으면, 회원가입 후 바로 로그인
      if (!existingUser) {
        user = await this.userService.createOauthUser({
          email: user.email,
          nickname: user.nickname,
          name: user.name,

          // email: req.user.email,
          // hashedPassword: '',
          // nickname: req.user.nickname,
          // name: req.user.name,
          // gender: '',
          // birth: '',
          // profileImage: '',
          // phoneNumber: '',
        });
      }
    } catch (error) {
      if (error instanceof ConflictException) {
        console.error(`Error:  ${error.message}`);
      } else {
        throw error;
      }
    }

    // 3. 로그인
    const accessToken = await this.createAccessToken({ user });
    const refreshToken = await this.createRefreshToken({ user });

    return {
      refreshToken,
      accessToken,
    };
  }
}