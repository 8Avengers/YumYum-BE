import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import * as dotenv from 'dotenv';
dotenv.config();

export class JwtGoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENTID,
      clientSecret: process.env.GOOGLE_CLIENTSECRET,
      callbackURL: process.env.GOOGLE_CALLBACKURL,
      scope: ['email', 'profile'],
    });
  }

  validate(googleToken, refreshToken, profile) {
    console.log('구글의 accessToken ::::::::', googleToken);
    console.log('구글의 refreshToken ::::::::', refreshToken);
    console.log('프로필찍어보자:::::::::::::::::::', profile);
    return {
      email: profile.emails[0].value,
      nickname: profile.displayName,
      name: profile.name.familyName,
    };
  }
}

/* TODO: null
return 값들이 req.user 에 들어가게 된다. outh.controller에서 확인할 수 있다.
      안보내 주는 것은 nullable 로 하자.
      나머지 전화번호 이런것들은 프로필편집페이지에서 하자


      name: '구글로그인성공 with 하드코딩',
      phoneNumber: '11111111111 with 하드코딩',
      gender: 'M with 하드코딩',
      age: 0 with 하드코딩,
      birth: '19920913 with 하드코딩',
      profileImage: 'sss with 하드코딩',
*/
