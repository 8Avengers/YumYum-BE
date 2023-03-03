import { PassportStrategy } from '@nestjs/passport';

import { Strategy } from 'passport-google-oauth20';

export class JwtGoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID:
        '1018735614364-cu3i346ikkr0rg0um6nmg3a5ee0oi673.apps.googleusercontent.com',
      clientSecret: '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',
      callbackURL: 'http://localhost:3000/login/google',
      scope: ['email', 'profile'],
    });
  }

  validate(accessToken, refreshToken, profile) {
    console.log('accessToken구글찍어보자::::::::', accessToken);
    console.log('refreshToken구글찍어보자::::::::', refreshToken);
    console.log('프로필찍어보자:::::::::::::::::::', profile);
    return {
      email: profile.emails[0].value,
      password: 'googleOauth!',
      // name: profile.displayName,
      name: '구글로그인',
      age: 0,
    };
  }
}

/*
return 값들이 req.user 에 들어가게 된다. outh.controller에서 확인할 수 있다.


*/
