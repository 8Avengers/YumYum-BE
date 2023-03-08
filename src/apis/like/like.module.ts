import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LikeController } from './like.controller';
import { LikeService } from './like.service';
import { PostLike } from './entities/post-like.entity';
import { CommentLike } from './entities/comment-like.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PostLike, CommentLike])],
  controllers: [LikeController],
  providers: [LikeService],
  exports: [LikeService, TypeOrmModule],
})
export class LikeModule {}
