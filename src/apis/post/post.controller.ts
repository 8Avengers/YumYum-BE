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
  Query,
} from '@nestjs/common';

import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { LocationDto } from './dto/location.dto';
import { CreateRestaurantDto } from '../restaurant/dto/create-restaurant.dto';
import { AuthAccessGuard } from '../auth/guards/auth.guards';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Post')
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  /*
              ### 23.03.03
              ### 이드보라
              ### 포스팅 상세보기
              */
  @ApiOperation({ summary: '포스팅 상세보기' })
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
  @ApiOperation({ summary: '모든 최신 포스팅 불러오기' })
  @Get()
  @UseGuards(AuthAccessGuard)
  async getPosts(@CurrentUser() currentUser: any, @Query('page') page: string) {
    const posts = await this.postService.getPosts(currentUser.id, page);
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
  @ApiOperation({ summary: '포스트 작성하기' })
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

    const parsedUserTags = JSON.parse(data.userTags);

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
      parsedUserTags,
      files,
      // data.userNames,
    );
  }

  /*
              ### 23.03.03
              ### 이드보라
              ### 포스팅 수정
              */
  @ApiOperation({ summary: '포스트 수정하기' })
  @Patch('/:postId')
  @UseGuards(AuthAccessGuard)
  @UseInterceptors(FilesInterceptor('files'))
  async updatePost(
    @UploadedFiles() files: Array<Express.Multer.File>,
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
    let parsedUserTags;
    if (data.myListId) {
      parsedMyListId = JSON.parse(data.myListId);
    }

    if (data.rating) {
      parsedRating = JSON.parse(data.rating);
    }

    if (data.hashtagNames) {
      parsedHashtagNames = JSON.parse(data.hashtagNames);
    }

    if (data.userTags) {
      parsedUserTags = JSON.parse(data.userTags);
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
      parsedUserTags,
      files,
      data.files,
    );
  }

  /*
              ### 23.03.07
              ### 이드보라
              ### 포스팅 삭제
              */
  @ApiOperation({ summary: '포스트 삭제하기' })
  @Delete('/:postId')
  @UseGuards(AuthAccessGuard)
  async deletePost(@Param('postId') postId: number) {
    return this.postService.deletePost(postId);
  }

  /*
    ### 23.03.20
    ### 이드보라
    ### 회원들의 추천 맛집
   */
  @ApiOperation({ summary: '회원들의 추천 맛집 불러오기' })
  @Get('/main/trending')
  async getTrendingPostsByCategory() {
    return this.postService.getTrendingPosts();
  }

  /*
    ### 23.03.21
    ### 이드보라
    ### 내 주변 피드
   */
  @ApiOperation({ summary: '내 주변 피드' })
  @Get('/feed/aroundMe')
  @UseGuards(AuthAccessGuard)
  async getPostsAroundMe(
    @Body() data: Partial<LocationDto>,
    @CurrentUser() currentUser: any,
    @Query('page') page: string,
  ) {
    return this.postService.getPostsAroundMe(
      data.x,
      data.y,
      currentUser.id,
      page,
    );
  }
}
