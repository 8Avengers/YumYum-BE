import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './common/config/typeorm.config.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({

      useClass: TypeOrmConfigService   
    }),
    //TODO: 모듈 삽입, 어떤 모듈을 넣는 게 맞을까
  ],

})
export class AppModule {}

