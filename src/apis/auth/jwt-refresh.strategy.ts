import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

//accessToken이랑 로직이 다르다.
@Injectable() //=> 왜 이것을 써야 할까
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor(private configService: ConfigService) {
    super({
      //얘는 쿠키에서 꺼내주는 게 없어서 우리가 만들어줘야 한다.

      jwtFromRequest: (req) => {
        const cookie = req.headers.cookie; // request header의 쿠키에서 refreshToken을 꺼내야 한다.
        const refreshToken = cookie.replace('refreshToken=', '');
        console.log('내가만든쿠키::::::::::::', cookie);
        console.log('내가추출한리프레시::::::::', refreshToken);

        return refreshToken;
      },

      // secretOrKey: 'p3Fe&ZxtEUx2@9sM4T%i8CcX@oMy6D^N',
      secretOrKey:
        configService.get('JWT_REFRESH_TOKEN_SECRET') || 'refreshToken',
    });
  }

  validate(payload) {
    console.log('리프레시!!payload:::::::::::::::::::', payload); //email: a@a.com , sub: user.id

    return {
      email: payload.email,
      id: payload.sub,
      profileImage: payload.profileImage,
    };

    /*
    return 까지 성공하면, 
    req.user.email,
    req.user.id
    이 custom data를 passport가 만들어준다. 

    */
  }
}
