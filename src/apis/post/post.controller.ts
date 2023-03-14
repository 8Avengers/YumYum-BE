import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Patch,
  UseGuards,
} from '@nestjs/common';

import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { CreateRestaurantDto } from "../restaurant/dto/create-restaurant.dto";
import { AuthAccessGuard } from '../auth/guards/auth.guards';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  /*
              ### 23.03.03
              ### 이드보라
              ### 포스팅 상세보기
              */
  @Get('/:postId')
  @UseGuards(AuthAccessGuard)
  async getPostById(
    @Param('postId') postId: number,
    @CurrentUser() currentUser: any,
  ) {
    return await this.postService.getPostById(postId, currentUser.id);
  }

  /*
              ### 23.03.03
              ### 이드보라
              ### 조건 없이 모든 포스팅 불러오기(뉴스피드 페이지)
              */
  @Get()
  @UseGuards(AuthAccessGuard)
  async getPosts(@CurrentUser() currentUser: any) {
    const posts = await this.postService.getPosts(currentUser.id);
    return posts;
  }

  // @Get('/hot-articles')
  // async getHotArticles() {
  //   return await this.postService.getHotArticles();
  // }

  /*
              ### 23.03.03
              ### 이드보라
              ### 포스팅 작성
              */
  @Post()
  @UseGuards(AuthAccessGuard)
  createPost(
    @Body() data: CreatePostDto,
    @Body() restaurantData: CreateRestaurantDto,
    @CurrentUser() currentUser: any,
  ) {
    return this.postService.createPost(
      currentUser.id,
      restaurantData.address_name,
      restaurantData.category_group_code,
      restaurantData.category_group_name,
      restaurantData.category_name,
      restaurantData.kakao_place_id,
      restaurantData.phone,
      restaurantData.place_name,
      restaurantData.road_address_name,
      restaurantData.x,
      restaurantData.y,
      data.myListId,
      data.content,
      data.rating,
      data.image,
      data.visibility,
      data.hashtagNames,
      // data.userNames,
    );
  }

  /*
              ### 23.03.03
              ### 이드보라
              ### 포스팅 수정
              */
  @Patch('/:postId')
  @UseGuards(AuthAccessGuard)
  async updateArticle(
    @Param('postId') postId: number,
    @Body() data: Partial<UpdatePostDto>,
    @Body() restaurantData: CreateRestaurantDto,
  ) {
    return this.postService.updatePost(
      postId,
      restaurantData.address_name,
      restaurantData.category_group_code,
      restaurantData.category_group_name,
      restaurantData.category_name,
      restaurantData.kakao_place_id,
      restaurantData.phone,
      restaurantData.place_name,
      restaurantData.road_address_name,
      restaurantData.x,
      restaurantData.y,
      data.myListId,
      data.content,
      data.rating,
      data.image,
      data.visibility,
      data.hashtagNames,
    );
  }

  /*
              ### 23.03.07
              ### 이드보라
              ### 포스팅 삭제
              */
  @Delete('/:postId')
  @UseGuards(AuthAccessGuard)
  async deletePost(@Param('postId') postId: number) {
    return this.postService.deletePost(postId);
  }
}
