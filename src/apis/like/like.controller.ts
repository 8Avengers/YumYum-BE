import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';

import { LikeService } from './like.service';
import { CreatePostLikeDto } from './dto/create-post-like.dto';
import { CreateCommentLikeDto } from './dto/create-comment-like.dto';

@Controller('likes')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Post('post')
  async createPostLike(@Body() data: CreatePostLikeDto) {
    return this.likeService.createPostLike(data.postId, data.userId);
  }

  @Post('comment')
  async createCommentLike(@Body() data: CreateCommentLikeDto) {
    return this.likeService.createCommentLike(data);
  }
}
