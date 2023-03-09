import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SearchModule } from './apis/search/search.module';
import { TypeOrmConfigService } from './common/config/typeorm.config.service';
import { PostModule } from './apis/post/post.module';
import { MyListModule } from './apis/my-list/my-list.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    SearchModule,
    MyListModule,
    PostModule,
    //TODO: 모듈 삽입, 어떤 모듈을 넣는 게 맞을까
  ],
})
export class AppModule {}
