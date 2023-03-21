import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Strategy, Profile } from 'passport-naver';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class JwtNaverStrategy extends PassportStrategy(Strategy, 'naver') {
  constructor() {
    super({
      clientID: process.env.NAVER_CLIENTID,
      clientSecret: process.env.NAVER_CLIENTSECRET,
      callbackURL: process.env.NAVER_CALLBACKURL,
      scope: ['email', 'profile'],
    });
  }
  validate(
    accessToken: string, //
    refreshToken: string, //
    profile: Profile, //
  ) {
    console.log('accessToken네이버찍어보자::::::::', accessToken);
    console.log('refreshToken네이버찍어보자::::::::', refreshToken);
    console.log('네이버 프로필찍어보자:::::::::::::::::::', profile);

    return {
      email: profile._json.email,
      nickname: profile._json.nickname,
    };
  }
}

/*
return 값들이 req.user 에 들어가게 된다. 

*/
