import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { Post } from './entities/post.entity';
import { PostLikeController } from './post-like.controller';
import { PostLikeService } from './post-like.service';
import { PostLike } from './entities/post-like.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post, PostLike])],
  controllers: [PostController, PostLikeController],
  providers: [PostService, PostLikeService],
  exports: [PostService, TypeOrmModule],
})
export class PostModule {}
