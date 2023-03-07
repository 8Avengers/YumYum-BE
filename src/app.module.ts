import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatBackEndModule } from './chatBackEnd/chatBackEnd.module';
import { ChatFrontEndModule } from './chatFrontEnd/chatFrontEnd.module';
import { TypeOrmConfigService } from './common/config/typeorm.config.service';
import * as mongoose from 'mongoose'; //몽구스
import { LoggerMiddleware } from './logger/logger.middleware'; //미완성 로그 => 강의를 중구난방으로 들어서 찾기 어려움

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    //몽구스 연결 process.env.MONGO_URL
    MongooseModule.forRoot(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // useCreateIndex: true,
      // useFindAndModify: false,
    }),

    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    ChatBackEndModule,
    ChatFrontEndModule,
  ],
})
//몽구스 추가설정(로그 미들웨어 등록)
export class AppModule implements NestModule {
  private readonly isDev: boolean = process.env.MODE === 'dev' ? true : false;
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
    mongoose.set('debug', this.isDev);
  }
}
