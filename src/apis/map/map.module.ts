import { CollectionItem } from './../collection/entities/collection-item.entity';
import { Follow } from '../user/entities/follow.entity';
import { Post } from '../post/entities/post.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { MapController } from './map.controller';
import { MapService } from './map.service';

@Module({
  imports: [TypeOrmModule.forFeature([Post, Follow, CollectionItem])],
  controllers: [MapController],
  providers: [MapService],
})
export class MapModule {}
