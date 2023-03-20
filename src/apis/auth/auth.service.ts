import { ConflictException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserSignupService } from '../user/user-signup.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService, //
    private readonly configService: ConfigService,
    private readonly userSignupService: UserSignupService,
  ) {}

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

  //소셜로그인 API
  async loginOauth({ user }) {
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

// //소셜회원가입 API
// async signupOauth({ user }) {
//   console.log('oauth 끝나면 나오는 유저찍어보자', user);

//   // 1. 가입확인
//   let existingUser = await this.userSignupService.findOne({
//     email: user.email,
//   });

//   if (existingUser)
//     throw new ConflictException(
//       '이미 등록된 이메일입니다. 소셜로그인해주세요.',
//     );

//   try {
//     // 2. 회원가입
//     if (!existingUser) {
//       user = await this.userSignupService.createOauthUser({
//         email: user.email,
//         nickname: user.nickname,
//         name: user.name,
//       });
//     }
//   } catch (error) {
//     if (error instanceof ConflictException) {
//       console.error(`Error:  ${error.message}`);
//     } else {
//       throw error;
//     }
//   }

//   // 3. 로그인
//   const accessToken = await this.createAccessToken({ user });
//   const refreshToken = await this.createRefreshToken({ user });

//   return {
//     refreshToken,
//     accessToken,
//     user: {
//       userId: user.id,
//       nickname: user.nickname,
//       email: user.email,
//       profileImage: user.profile_image,
//     },
//   };
// }
