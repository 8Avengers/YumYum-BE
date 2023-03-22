import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { UserSignupService } from '../user/user-signup.service';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

import { JwtAccessStrategy } from './strategies/jwt-access.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { JwtGoogleStrategy } from './strategies/jwt-social-google.strategy';
import { JwtKakaoStrategy } from './strategies/jwt-social-kakao.strategy';
import { JwtNaverStrategy } from './strategies/jwt-social-naver.strategy';

//passport미사용 service
import { SocialKakaoService } from './social-kakao.service';
import { SocialNaverService } from './social-naver.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    JwtModule.register({}),
    TypeOrmModule.forFeature([User]),
    UserModule,
    HttpModule,
  ],
  providers: [
    JwtGoogleStrategy,
    JwtNaverStrategy,
    JwtKakaoStrategy,
    JwtRefreshStrategy,
    JwtAccessStrategy,
    AuthService,
    UserSignupService,
    //
    //아래는passport미사용
    SocialNaverService,
    SocialKakaoService,
  ],

  controllers: [AuthController],
})
export class AuthModule {}
