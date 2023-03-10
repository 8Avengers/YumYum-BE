import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './apis/auth/auth.module';
import { UserModule } from './apis/user/user.module';
import { TypeOrmConfigService } from './common/config/typeorm.config.service';
import { PostModule } from './apis/post/post.module';
import { Collection } from './apis/collection/entities/collection.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    Collection,
    PostModule,
    UserModule, //
    AuthModule, //
  ],
})
export class AppModule {}