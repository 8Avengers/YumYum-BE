import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';

import { PostLikeService } from './post-like.service';
import { CreatePostLikeDto } from './dto/create-post-like.dto';

@Controller('posts/:postId/like')
export class PostLikeController {
  constructor(private readonly postLikeService: PostLikeService) {}

  @Post()
  async likePost(
    @Body() data: CreatePostLikeDto,
    @Param('postId') postId: number,
  ) {
    await this.postLikeService.likePost(postId, data.userId);
  }

  @Delete()
  async unlikePost(@Param('postId') postId: number) {
    const userId = 1;
    await this.postLikeService.unlikePost(postId, userId);
  }
}
