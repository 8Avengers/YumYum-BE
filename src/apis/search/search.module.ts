import { Hashtag } from './../post/entities/hashtag.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Restaurant } from './../restaurant/entities/restaurant.entity';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Restaurant, Hashtag])],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
