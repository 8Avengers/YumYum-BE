import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';

import { CommentLikeService } from './comment-like.service';
import { CreateCommentLikeDto } from './dto/create-comment-like.dto';

@Controller('likes')
export class CommentLikeController {
  constructor(private readonly commentLikeService: CommentLikeService) {}

  @Post('comment')
  async createCommentLike(@Body() data: CreateCommentLikeDto) {
    return this.commentLikeService.createCommentLike(
      data.commentId,
      data.userId,
    );
  }
}
