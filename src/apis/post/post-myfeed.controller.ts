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

  // 마이피드에서는 나는 내 전체 게시글을 볼 수 있다 (public, private)
  // 로그인한 유저와 피드의 유저가 일치하면 public, private 게시글이 보인다.
  // 로그인한 유저와 피드의 유저가 불일치하면 public 게시글만 보인다.

  // 지도에서는 나는 내 전체 게시글을 볼 수 있다. 나의 전체 마커를 볼 수 있다. (public, private)
  // 로그인한 유저와 피드의 유저가 일치하면 public, private 전체 마커가 보인다.
  // 로그인한 유저와 피드의 유저가 불일치하면 그 사람의 public 마커만 보인다.

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
