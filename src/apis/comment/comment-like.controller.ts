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
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('CommentLike')
@Controller('posts/:postId/comments/:commentId/like')
export class CommentLikeController {
  constructor(private readonly commentLikeService: CommentLikeService) {}

  @ApiOperation({ summary: '댓글 좋아요하기' })
  @Post()
  @UseGuards(AuthAccessGuard)
  async likeComment(
    @Param('commentId') commentId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.commentLikeService.likeComment(commentId, currentUser.id);
  }

  @ApiOperation({ summary: '댓글 좋아요 취소' })
  @Delete()
  @UseGuards(AuthAccessGuard)
  async unlikeComment(
    @Param('commentId') commentId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.commentLikeService.unlikeComment(commentId, currentUser.id);
  }
}
