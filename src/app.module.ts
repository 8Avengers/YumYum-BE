import { MapModule } from './apis/map/map.module';
import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './common/config/typeorm.config.service';
import { SearchModule } from './apis/search/search.module';
import { PostModule } from './apis/post/post.module';
import { CommentModule } from './apis/comment/comment.module';
import { AuthModule } from './apis/auth/auth.module';
import { UserModule } from './apis/user/user.module';
import { CollectionModule } from './apis/collection/collection.module';
import { RestaurantModule } from './apis/restaurant/restaurant.module';
import { UploadModule } from './apis/upload/upload.module';
import * as cron from 'node-cron';
import { AdminModule } from './apis/administrator/admin.module';
import { AdminService } from './apis/administrator/admin.service';
import { ReportModule } from './apis/report/report.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    CollectionModule,
    SearchModule,
    PostModule,
    AdminModule,
    UserModule,
    AuthModule,
    CommentModule,
    UserModule,
    AuthModule,
    ReportModule,
    RestaurantModule,
    UploadModule,
    MapModule,
  ],
})
export class AppModule implements OnModuleInit {
  constructor(private adminService: AdminService) {}
  onModuleInit() {
    cron.schedule('* * * * *', async () => {
      await this.adminService.liftBanOnExpiredUsers();
    });
  }
}
