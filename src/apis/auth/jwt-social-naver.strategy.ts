import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Strategy, Profile } from 'passport-naver';

@Injectable()
export class JwtNaverStrategy extends PassportStrategy(Strategy, 'naver') {
  constructor() {
    super({
      clientID: '3NECxObNoFoTyWJWe4bs',
      clientSecret: '6aXyVRv8gB',
      callbackURL: 'http://localhost:3000/login/naver',
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
      password: 'naverOauth!',
      name: '네이버로그인',
      age: 0,
    };
  }
}

/*
return 값들이 req.user 에 들어가게 된다. 

*/
