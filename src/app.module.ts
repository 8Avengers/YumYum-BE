import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './common/config/typeorm.config.service';
import { SearchModule } from './apis/search/search.module';
import { PostModule } from './apis/post/post.module';
import { CommentModule } from './apis/comment/comment.module';
import { AuthModule } from './apis/auth/auth.module';
import { UserModule } from './apis/user/user.module';
import { CollectionModule } from './apis/collection/collection.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    CollectionModule,
    SearchModule,
    PostModule,
    CommentModule,
    UserModule, //
    AuthModule, //
  ],
})
export class AppModule {}
