import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { Post } from './entities/post.entity';
import { PostLikeController } from './post-like.controller';
import { PostLikeService } from './post-like.service';
import { PostLike } from './entities/post-like.entity';
import { Hashtag } from './entities/hashtag.entity';
import { PostHashtagService } from './post-hashtag.service';
import { CollectionModule } from '../collection/collection.module';
import { MyFeedController } from './post-myfeed.controller';
import { Comment } from '../comment/entities/comment.entity';
import { RestaurantModule } from '../restaurant/restaurant.module';
import { Image } from './entities/image.entity';
import { ImageRepository } from './image.repository';
import { UploadModule } from '../upload/upload.module';

// import { PostUserTagService } from './post-user-tag.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, PostLike, Hashtag, Comment, Image]),
    CollectionModule,
    RestaurantModule,
    UploadModule,
  ],
  controllers: [PostController, PostLikeController, MyFeedController],
  providers: [
    PostService,
    PostLikeService,
    PostHashtagService,
    ImageRepository,
  ],
  exports: [PostService, TypeOrmModule],
})
export class PostModule {}
