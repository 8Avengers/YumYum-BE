import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { AuthAccessGuard } from '../auth/guards/auth.guards';

import { PostService } from './post.service';

@ApiTags('나의피드불러오기')
@Controller('/')
export class MyFeedController {
  constructor(
    private readonly postService: PostService, //
  ) {}

  @ApiOperation({ summary: '내 피드 게시글 불러오기' })
  @Get('/myfeed')
  @UseGuards(AuthAccessGuard)
  async getMyFeed(
    @CurrentUser() currentUser: any,
    @Query('page') page: string,
  ) {
    const userId = currentUser.id;
    const myPosts = await this.postService.getPostsByMyId(userId, page);
    return myPosts;
  }
}
