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

import { PostLikeService } from './post-like.service';
import { AuthAccessGuard } from '../auth/guards/auth.guards';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('PostLike')
@Controller('posts/:postId/like')
export class PostLikeController {
  constructor(private readonly postLikeService: PostLikeService) {}

  @ApiOperation({ summary: '포스트 좋아요하기' })
  @Post()
  @UseGuards(AuthAccessGuard)
  async likePost(
    @Param('postId') postId: number,
    @CurrentUser() currentUser: any,
  ) {
    await this.postLikeService.likePost(postId, currentUser.id);
  }

  @ApiOperation({ summary: '포스트 좋아요취소하기' })
  @Delete()
  @UseGuards(AuthAccessGuard)
  async unlikePost(
    @Param('postId') postId: number,
    @CurrentUser() currentUser: any,
  ) {
    await this.postLikeService.unlikePost(postId, currentUser.id);
  }
}
