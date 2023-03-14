import { ApiTags } from '@nestjs/swagger';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { AuthAccessGuard } from '../auth/guards/auth.guards';

import { PostService } from './post.service';

@ApiTags('나의피드불러오기')
@Controller('/')
export class MyFeedController {
  constructor(
    private readonly postService: PostService, //
  ) {}

  @Get('/myfeed')
  @UseGuards(AuthAccessGuard)
  async getMyFeed(@CurrentUser() currentUser: any) {
    const userId = currentUser.id;
    const myPosts = await this.postService.getMyPosts(userId);
    return myPosts;
  }
}
