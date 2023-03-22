import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable() //=> 왜 이것을 써야 할까
export class JwtAccessStrategy extends PassportStrategy(Strategy, 'access') {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey:
        configService.get('JWT_ACCESS_TOKEN_SECRET') || 'accessToken',
    });
  }

  validate(payload) {
    console.log('액세스토큰의 payload 인가완료:::::::::::', payload); //email: a@a.com , sub: user.id

    return {
      email: payload.email,
      id: payload.id,
      nickname: payload.nickname,
      profileImage: payload.profileImage,
    };
  }
}

/*
    return 까지 성공하면, 
    req.user.email,
    req.user.id,
    req.profile_image,
    이 custom data를 passport가 만들어준다. 

    */
