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
        expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRES_SEC'),
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
        expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_SEC'),
      },
    );
    return refreshToken;
  }

  async loginOauth({ req, res }) {
    try {
      // 1. 가입확인
      let user = await this.userService.findOne({ email: req.user.email });

      // 2. 회원가입
      if (!user) {
        user = await this.userService.createUser({
          email: req.user.email,
          hashedPassword: req.user.password,
          nickname: req.user.nickname,
          name: req.user.name,
          gender: req.user.gender,
          birth: req.user.birth,
          profileImage: req.user.profileImage,
          phoneNumber: req.user.phoneNumber,
        });
      }
    } catch (error) {
      if (error instanceof ConflictException) {
        console.error(
          `Error: The nickname is already in use: ${error.message}`,
        );
        // Handle the error here, for example by redirecting the user to a different page
      } else {
        throw error;
      }
    }

    // 3. 로그인
    // this.createRefreshToken({ user, res }); //자기 자신의 리프레시 토큰을 가지고 오는 것이다.이제 req, res만 밖에서 받아오면 된다.
    res.redirect('http://localhost:5500/frontend/social-login.html');
  }
}

//개발환경 쿠키는 헤더에 들어가 있다.
//     res.setHeader('set-cookie', `refreshToken=${refreshToken}; path=/;`);
