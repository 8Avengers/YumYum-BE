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
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';

import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { CreateRestaurantDto } from '../restaurant/dto/create-restaurant.dto';
import { AuthAccessGuard } from '../auth/guards/auth.guards';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { FilesInterceptor } from '@nestjs/platform-express';

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
  @UseInterceptors(FilesInterceptor('files'))
  createPost(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() data: CreatePostDto,
    @Body()
    {
      address_name,
      category_group_code,
      category_group_name,
      category_name,
      id,
      phone,
      place_name,
      road_address_name,
      x,
      y,
    }: CreateRestaurantDto,
    @CurrentUser() currentUser: any,
  ) {
    const parsedMyListId = JSON.parse(data.myListId);

    const parsedRating = JSON.parse(data.rating);

    const parsedHashtagNames = JSON.parse(data.hashtagNames);

    return this.postService.createPost(
      currentUser.id,
      address_name,
      category_group_code,
      category_group_name,
      category_name,
      id,
      phone,
      place_name,
      road_address_name,
      x,
      y,
      parsedMyListId,
      data.content,
      parsedRating,
      data.visibility,
      parsedHashtagNames,
      files,
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
  @UseInterceptors(FilesInterceptor('files'))
  async updatePost(
    @UploadedFiles() files: Array<Express.Multer.File | string>,
    @Param('postId') postId: number,
    @Body() data: Partial<UpdatePostDto>,
    @Body()
    {
      address_name,
      category_group_code,
      category_group_name,
      category_name,
      id,
      phone,
      place_name,
      road_address_name,
      x,
      y,
    }: Partial<CreateRestaurantDto>,
  ) {
    let parsedMyListId;
    let parsedRating;
    let parsedHashtagNames;
    if (data.myListId) {
      parsedMyListId = JSON.parse(data.myListId);
    }

    if (data.rating) {
      parsedRating = JSON.parse(data.rating);
    }

    if (data.hashtagNames) {
      parsedHashtagNames = JSON.parse(data.hashtagNames);
    }

    return this.postService.updatePost(
      postId,
      address_name,
      category_group_code,
      category_group_name,
      category_name,
      id,
      phone,
      place_name,
      road_address_name,
      x,
      y,
      parsedMyListId,
      data.content,
      parsedRating,
      data.visibility,
      parsedHashtagNames,
      files,
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
