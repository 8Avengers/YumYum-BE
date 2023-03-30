import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { User } from '../user/entities/user.entity';
import { Restaurant } from '../restaurant/entities/restaurant.entity';
import { Post } from '../post/entities/post.entity';
import { Comment } from '../comment/entities/comment.entity';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { Reports } from '../report/entities/report.entity';

// 블랙리스트 관리, 포스트 및 댓글 삭제 권한, 레스토랑관리(?)

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Post, Restaurant, Comment, Reports]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
