import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
// import { BookmarkController } from '../collection/bookmark.controller';
// import { BookmarkService } from '../collection/bookmark.service';
import { Post } from '../post/entities/post.entity';
import { Collection } from '../collection/entities/collection.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Collection, Post])],
  //   controllers: [BookmarkController],
  //   providers: [BookmarkService],
})
export class CollectionModule {}
