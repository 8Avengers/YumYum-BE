import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

import { JwtAccessStrategy } from './jwt-access.strategy';
import { JwtRefreshStrategy } from './jwt-refresh.strategy';
import { JwtGoogleStrategy } from './jwt-social-google.strategy';
import { JwtKakaoStrategy } from './jwt-social-kakao.strategy';
import { JwtNaverStrategy } from './jwt-social-naver.strategy';

@Module({
  imports: [
    JwtModule.register({}),
    TypeOrmModule.forFeature([User]),
    UserModule,
  ],
  providers: [
    JwtGoogleStrategy, //
    JwtNaverStrategy, //
    JwtKakaoStrategy, //
    JwtRefreshStrategy, //
    JwtAccessStrategy, //
    UserService, //
    AuthService,
  ],

  controllers: [AuthController],
})
export class AuthModule {}