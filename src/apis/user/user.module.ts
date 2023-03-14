import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserProfileController } from './user-profile.controller';
import { UserProfileService } from './user-profile.service';
import { Collection } from '../collection/entities/collection.entity';
import { Follow } from './entities/follow.entity';
import { UserSignupController } from './user-signup.controller';
import { UserSignupService } from './user-signup.service';
import { UploadModule } from './../upload/upload.module';
import { UploadService } from '../upload/upload.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Collection, Follow]), UploadModule],
  controllers: [UserProfileController, UserSignupController],
  providers: [UserProfileService, UserSignupService, UploadService],
  exports: [UserProfileService, UserSignupService, TypeOrmModule],
})
export class UserModule {}
