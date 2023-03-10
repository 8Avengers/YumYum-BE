import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TypeOrmConfigService } from './common/config/typeorm.config.service';
import { PostModule } from './apis/post/post.module';
import { CollectionModule } from './apis/collection/collection.module';
import { AuthModule } from './apis/auth/auth.module';
import { UserModule } from './apis/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),

    PostModule,
    CollectionModule,
    UserModule, //
    AuthModule, //
    
  ],
})
export class AppModule {}
