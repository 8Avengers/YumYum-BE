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

@Controller('posts/:postId/comments/:commentId/like')
export class CommentLikeController {
  constructor(private readonly commentLikeService: CommentLikeService) {}

  @Post()
  async likeComment(
    @Body() data: CreateCommentLikeDto,
    @Param('commentId') commentId: number,
  ) {
    return this.commentLikeService.likeComment(commentId, data.userId);
  }
}
