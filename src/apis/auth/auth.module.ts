import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { AuthController } from './auth.controller';

import { AuthService } from './auth.service';
import { JwtAccessStrategy } from './jwt-access.strategy';
import { JwtRefreshStrategy } from './jwt-refresh.strategy';
import { JwtGoogleStrategy } from './jwt-social-google.strategy';
import { JwtKakaoStrategy } from './jwt-social-kakao.strategy';
import { JwtNaverStrategy } from './jwt-social-naver.strategy';

@Module({
  imports: [JwtModule.register({}), TypeOrmModule.forFeature([User])],
  providers: [
    JwtGoogleStrategy, //
    JwtNaverStrategy, //
    JwtKakaoStrategy, //
    JwtRefreshStrategy, //
    JwtAccessStrategy, //
    AuthService, //
    UserService, //
  ],
  controllers: [AuthController],
})
export class AuthModule {}
