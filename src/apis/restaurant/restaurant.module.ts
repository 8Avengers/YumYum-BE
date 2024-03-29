import { Post } from './../post/entities/post.entity';
import { Restaurant } from 'src/apis/restaurant/entities/restaurant.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { RestaurantController } from './restaurant.controller';
import { RestaurantService } from './restaurant.service';
@Module({
  imports: [TypeOrmModule.forFeature([Restaurant, Post])],
  controllers: [RestaurantController],
  providers: [RestaurantService],
  exports: [RestaurantService, TypeOrmModule],
})
export class RestaurantModule {}
