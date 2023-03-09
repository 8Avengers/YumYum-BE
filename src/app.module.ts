import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './common/config/typeorm.config.service';
import { PostModule } from './apis/post/post.module';
import { CollectionModule } from './apis/bookmark-collection/bookmark-collection.module';
import { BookmarkModule } from './apis/bookmark/bookmark.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),

    PostModule,
    CollectionModule,
    BookmarkModule,
    //TODO: 모듈 삽입, 어떤 모듈을 넣는 게 맞을까
  ],
})
export class AppModule {}
