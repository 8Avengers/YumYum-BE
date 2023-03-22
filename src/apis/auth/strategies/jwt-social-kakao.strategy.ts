import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-kakao';

export class JwtKakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor() {
    super({
      clientID: process.env.KAKAO_CLIENT_ID_RESTAPI,
      clientSecret: process.env.KAKAO_CLIENT_SECRET,
      callbackURL: process.env.KAKAO_CALLBACKURL,
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
      nickname: profile.displayName,
    };
  }
}

/*
return 값들이 req.user 에 들어가게 된다. 

*/
