import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './apis/auth/auth.module';
import { UserModule } from './apis/user/user.module';
import { TypeOrmConfigService } from './common/config/typeorm.config.service';
import { PostModule } from './apis/post/post.module';
import { CommentModule } from './apis/comment/comment.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    PostModule,
    CommentModule,
    UserModule, //
    AuthModule, //
  ],
})
export class AppModule {}
