import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CollectionController } from './bookmark-collection.controller';
import { CollectionService } from './bookmark-collection.service';
import { BookmarkCollection } from './entities/bookmark-collection.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BookmarkCollection])],
  controllers: [CollectionController],
  providers: [CollectionService],
})
export class CollectionModule {}
