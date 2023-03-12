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

@Controller('posts/:postId/like')
export class PostLikeController {
  constructor(private readonly postLikeService: PostLikeService) {}

  @Post()
  async likePost(@Param('postId') postId: number) {
    const userId = 1;
    await this.postLikeService.likePost(postId, userId);
  }

  @Delete()
  async unlikePost(@Param('postId') postId: number) {
    const userId = 1;
    await this.postLikeService.unlikePost(postId, userId);
  }
}
