import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';

//accessToken이랑 로직이 다르다.
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor() {
    super({
      //얘는 쿠키에서 꺼내주는 게 없어서 우리가 만들어줘야 한다.

      jwtFromRequest: (req) => {
        const cookie = req.headers.cookie; //쿠키의 헤더에서 refreshToken을 꺼내야 한다.
        const refreshToken = cookie.replace('refreshToken=', '');
        console.log('내가만든쿠키::::::::::::', cookie);
        console.log('니가추출한리프레시::::::::', refreshToken);

        return refreshToken;
      },

      secretOrKey: 'myRefreshKey',
    });
  }

  validate(payload) {
    console.log('리프레시!!payload::::::::::::::::::::::::::::::', payload); //email: a@a.com , sub: user.id

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
