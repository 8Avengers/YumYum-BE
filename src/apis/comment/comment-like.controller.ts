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

@Controller('posts/:postId/comments/:commentId/like')
export class CommentLikeController {
  constructor(private readonly commentLikeService: CommentLikeService) {}

  @Post()
  async likeComment(@Param('commentId') commentId: number) {
    const userId = 1;
    return this.commentLikeService.likeComment(commentId, userId);
  }

  @Delete()
  async unlikeComment(@Param('commentId') commentId: number) {
    const userId = 1;
    return this.commentLikeService.unlikeComment(commentId, userId);
  }
}
