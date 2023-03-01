import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';

export class JwtAccessStrategy extends PassportStrategy(Strategy, 'access') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), //req.headers.Authorization...

      secretOrKey: 'myAccessKey',
    });
  }

  validate(payload) {
    console.log('payload::::::::::::::::::::::::::::::', payload); //email: a@a.com , sub: user.id

    return {
      email: payload.email,
      id: payload.sub,
    };

    /*
    return 까지 성공하면, 
    req.user.email,
    req.user.id
    이 custom data를 passport가 만들어준다. 

    */
  }
}
