import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './common/config/typeorm.config.service';
import { SearchModule } from './apis/search/search.module';
import { PostModule } from './apis/post/post.module';
import { AuthModule } from './apis/auth/auth.module';
import { UserModule } from './apis/user/user.module';
import { CollectionModule } from './apis/collection/collection.module';
import { ImagesModule } from './images/images.module';
import { ImagesController } from './images/images.controller';
import { ImagesService } from './images/images.service';
import { UploadsModule } from './uploads/uploads.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    CollectionModule,
    SearchModule,
    PostModule,
    UserModule,
    AuthModule,
    ImagesModule,
    UploadsModule,
  ],
  controllers: [ImagesController],
  providers: [ImagesService],
})
export class AppModule {}
