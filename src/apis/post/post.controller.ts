import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';

import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
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
  async getPostById(@Param('postId') postId: number) {
    return await this.postService.getPostById(postId);
  }

  /*
            ### 23.03.03
            ### 이드보라
            ### 조건 없이 모든 포스팅 불러오기(뉴스피드 페이지)
            */
  @Get()
  async getPosts() {
    const posts = await this.postService.getPosts();
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
    @Body() data: CreatePostDto, //
    @CurrentUser() currentUser: any,
  ) {
    return this.postService.createPost(
      currentUser.id,
      data.restaurantId,
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
  @Put('/:postId')
  async updateArticle(
    @Param('postId') postId: number,
    @Body() data: UpdatePostDto,
  ) {
    return this.postService.updatePost(
      postId,
      data.restaurantId,
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
  async deletePost(@Param('postId') postId: number) {
    return this.postService.deletePost(postId);
  }
}
