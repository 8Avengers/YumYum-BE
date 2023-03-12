import { Injectable } from '@nestjs/common';

import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-kakao';

@Injectable()
export class JwtKakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor() {
    super({
      clientID: 'eeee492427b93e266e8aee30e1563978', //RESTAPI키
      clientSecret: 'chGVh4I1tPP8Xfg86FOGcB1ph0WyXXY3', //활성화
      callbackURL: 'http://localhost:3000/login/kakao',
      scope: ['account_email', 'profile_nickname'],
    });
  }

  validate(
    accessToken: string, //
    refreshToken: string, //
    profile: Profile, //
  ) {
    console.log('accessToken카카오찍어보자::::::::', accessToken);
    console.log('refreshToken카카오찍어보자::::::::', refreshToken);
    console.log('카카오 프로필찍어', profile);
    return {
      email: profile._json.kakao_account.email,
      name: profile.displayName,
    };
  }
}

/*
return 값들이 req.user 에 들어가게 된다. 

*/
