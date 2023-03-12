import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { Collection } from '../collection/entities/collection.entity';
import { profileController } from './profile.controller';
import { ProfileService } from './profile.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Collection])],
  controllers: [UserController, profileController],
  providers: [UserService, ProfileService],
  exports: [UserService, TypeOrmModule],
})
export class UserModule {}
