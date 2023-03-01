import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService, //
    private readonly configService: ConfigService
  
  
  ) {}
 


  createRefreshToken({user, res}) {
    const refreshToken = this.jwtService.sign({
        
      email: user.email,
      sub: user.id,
    }, {
      secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET')
      ,
      expiresIn: '2w',
    });

    console.log('::::::::::::authservice에서 refreshToken이뭘까?::::::::',refreshToken)

    //개발환경 쿠키는 헤더에 들어가 있다.
   res.setHeader('set-cookie', `refreshToken=${refreshToken}; path=/;`);
   res.send({ refreshToken, user});
    //누가 들어가는지 확인용브라우저에 나올수있다.


    /* 배포할때 바꿔주자.
     쿠키에 저장할 때 보안옵션을 줄 수 있다.
     
    res.setHeader('Access-Control-Allow-Origin', 'https://myfrontsite.com')
    res.setHeader(
    'Set-Cookie',
    `refreshToken=${refreshToken}; path=/; domain=.mybacksite.com; SameSite=None; Secure; httpOnly;`
        )

    */
  }


  createAccessToken({user}) {
    console.log('::::authService에서user가 뭘까?::::',user);
    
    const accessToken = this.jwtService.sign(
    { email: user.email,  sub: user.id, },// 
    { secret: 'myAccessKey',expiresIn: '30s',});

    console.log(':::::::::authService에서 accessToken이 뭘까?::::::',accessToken);
    
    return accessToken
    // return res.send({ accessToken });

    
  }

}
