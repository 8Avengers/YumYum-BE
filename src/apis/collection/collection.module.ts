import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { BookmarkController } from './bookmark.controller';
import { BookmarkService } from './bookmark.service';
import { Post } from '../post/entities/post.entity';
import { Comment } from '../comment/entities/comment.entity';
import { Collection } from '../collection/entities/collection.entity';
import { CollectionItem } from './entities/collection-item.entity';
import { MyListController } from './my-list.controller';
import { MyListService } from './my-list.service';
import { PostService } from '../post/post.service';
import { PostLike } from '../post/entities/post-like.entity';
import { Hashtag } from '../post/entities/hashtag.entity';
import { Image } from '../post/entities/image.entity';
import { PostLikeService } from '../post/post-like.service';
import { ImageRepository } from '../post/image.repository';
import { PostHashtagService } from '../post/post-hashtag.service';
import { RestaurantModule } from '../restaurant/restaurant.module';
import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Collection,
      Post,
      CollectionItem,
      PostLike,
      Comment,
      Image,
      Hashtag,
    ]),
    RestaurantModule,
    UploadModule,
  ],
  controllers: [BookmarkController, MyListController],
  providers: [
    BookmarkService,
    MyListService,
    PostService,
    PostLikeService,
    ImageRepository,
    PostHashtagService,
  ],
  exports: [MyListService, TypeOrmModule],
})
export class CollectionModule {}
