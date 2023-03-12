import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { Comment } from './entities/comment.entity';
// import { PostService } from '../post/post.service';
import { PostModule } from '../post/post.module';
import { CommentLikeController } from './comment-like.controller';
import { CommentLikeService } from './comment-like.service';
import { CommentLike } from './entities/comment-like.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, CommentLike]), PostModule],
  controllers: [CommentController, CommentLikeController],
  providers: [CommentService, CommentLikeService],
})
export class CommentModule {}
