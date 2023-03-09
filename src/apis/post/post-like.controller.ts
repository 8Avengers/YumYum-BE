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
import { CreatePostLikeDto } from '../post/dto/create-post-like.dto';

@Controller('likes')
export class PostLikeController {
  constructor(private readonly postLikeService: PostLikeService) {}

  @Post('post')
  async createPostLike(@Body() data: CreatePostLikeDto) {
    return this.postLikeService.createPostLike(data.postId, data.userId);
  }
}
