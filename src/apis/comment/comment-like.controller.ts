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

import { CommentLikeService } from './comment-like.service';
import { AuthAccessGuard } from '../auth/guards/auth.guards';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('posts/:postId/comments/:commentId/like')
export class CommentLikeController {
  constructor(private readonly commentLikeService: CommentLikeService) {}

  @Post()
  @UseGuards(AuthAccessGuard)
  async likeComment(
    @Param('commentId') commentId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.commentLikeService.likeComment(commentId, currentUser.id);
  }

  @Delete()
  @UseGuards(AuthAccessGuard)
  async unlikeComment(
    @Param('commentId') commentId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.commentLikeService.unlikeComment(commentId, currentUser.id);
  }
}
