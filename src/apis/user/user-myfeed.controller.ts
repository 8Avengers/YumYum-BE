// import { ApiTags } from '@nestjs/swagger';
// import { Controller, Get, UseGuards } from '@nestjs/common';
// import { CurrentUser } from 'src/common/decorators/current-user.decorator';
// import { AuthAccessGuard } from '../auth/guards/auth.guards';

// import { PostService } from '../post/post.service';

// @ApiTags('유저프로필/팔로우/팔로잉')
// @Controller('/')
// export class UserFeedController {
//   constructor(
//     private readonly postService: PostService, //
//   ) {}

//   @Get('/myfeed')
//   @UseGuards(AuthAccessGuard)
//   async getMyFeed(@CurrentUser() currentUser: any) {
//     const myPosts = await this.postService.getPostsByAuthor(currentUser.id);
//     return myPosts;
//   }
// }
