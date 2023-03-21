import { TypeOrmModule } from '@nestjs/typeorm';
import { forwardRef, Module } from '@nestjs/common';
import { BookmarkController } from './bookmark.controller';
import { BookmarkService } from './bookmark.service';
import { Post } from '../post/entities/post.entity';
import { Collection } from '../collection/entities/collection.entity';
import { CollectionItem } from './entities/collection-item.entity';
import { MyListController } from './my-list.controller';
import { MyListService } from './my-list.service';
import { Comment } from '../comment/entities/comment.entity';
import { PostLike } from '../post/entities/post-like.entity';
import { Hashtag } from '../post/entities/hashtag.entity';
import { RestaurantModule } from '../restaurant/restaurant.module';
import { UploadModule } from '../upload/upload.module';
import { PostService } from '../post/post.service';
import { PostLikeService } from '../post/post-like.service';
import { ImageRepository } from '../post/image.repository';
import { PostHashtagService } from '../post/post-hashtag.service';
import { Image } from '../post/entities/image.entity';
import { PostModule } from '../post/post.module';

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
    forwardRef(() => PostModule),
  ],
  controllers: [BookmarkController, MyListController],
  providers: [
    BookmarkService,
    MyListService,
    PostHashtagService,
    PostService,
    PostLikeService,
    ImageRepository,
  ],
  exports: [MyListService, TypeOrmModule],
})
export class CollectionModule {}
