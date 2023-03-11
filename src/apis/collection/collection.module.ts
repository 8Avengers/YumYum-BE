import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { BookmarkController } from '../collection/bookmark.controller';
import { BookmarkService } from '../collection/bookmark.service';
import { Post } from '../post/entities/post.entity';
import { Collection } from '../collection/entities/collection.entity';
import { CollectionItem } from './entities/collection-item.entity';
import { MyListController } from './my-list.controller';
import { MyListService } from './my-list.service';

@Module({
  imports: [TypeOrmModule.forFeature([Collection, Post, CollectionItem])],
  controllers: [BookmarkController, MyListController],
  providers: [BookmarkService, MyListService],
})
export class CollectionModule {}
