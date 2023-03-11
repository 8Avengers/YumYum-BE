// import { Controller, Post, Get, Put, Delete } from '@nestjs/common';
// import { Body, Param, UseGuards } from '@nestjs/common/decorators';
// import {
//   ApiCreatedResponse,
//   ApiOkResponse,
//   ApiUnauthorizedResponse,
// } from '@nestjs/swagger';

// import { UpdateMyListDto } from './dto/create-my-list.dto';
// import { CreateMyListDto } from './dto/update-my-list.dto';
// import { MyListService } from './my-list.service';
// import { AuthAccessGuard, AuthRefreshGuard } from '../auth/guards/auth.guards';
// import { CurrentUser } from 'src/common/decorators/current-user.decorator';

// // @Controller('my-list')
// // export class MyListController {
// //   constructor(private readonly myListService: MyListService) {}
// //   /*
// //     ### 23.03.10
// //     ### 표정훈
// //     ### MyList 전체조회(해당 유저의 맛집리스트만 불러오기)
// //     */
// //   // @UseGuards(AuthGuard('local'))
// //   @Get('/:userId')
// //   @ApiOkResponse({
// //     description: 'MyList 전체조회(해당 유저의 맛집리스트만 불러오기)',
// //   })
// //   @ApiUnauthorizedResponse({ description: '전체조회 실패' })
// //   async getMyLists(@Param('userId') userId: number) {
// //     const myLists = await this.myListService.getMyList(userId);
// //     return  myLists;

// //   /*
// //     ### 23.03.10
// //     ### 표정훈
// //     ### MyList 생성(이름만 입력, 타입은 myList자동생성)
// //     */
// //   // @UseGuards(AuthGuard('local'))
// //   @Post()
// //   @ApiCreatedResponse({
// //     description: 'MyList 생성완료(이름만 입력, 타입은 myList자동생성)',
// //   })
// //   @ApiUnauthorizedResponse({ description: 'MyList 생성실패' })

// //   createMyList(@Body() data: CreateMyListDto) {
// //     const userId = 1;
// //     return this.myListService.createMyList(userId, data.name, data.type);
// //   }

// //   /*
// //     ### 23.03.10
// //     ### 표정훈
// //     ### MyList 수정
// //     */

// //   @Put('/:collectionId')
// //   @ApiOkResponse({
// //     description: 'MyList 수정',
// //   })
// //   @ApiUnauthorizedResponse({ description: 'MyList 수정실패' })
// //   async updateMyList(
// //     // @Param('userId') userId: number,
// //     @Param('collectionId') collectionId: number,
// //     @Body() data: UpdateMyListDto,
// //   ) {
// //     const userId = 1;
// //     return this.myListService.updateMyList(
// //       userId,
// //       collectionId,
// //       data.name,
// //       data.image,
// //       data.description,
// //       data.visibility,
// //     );
// //   }
// //   /*
// //     ### 23.03.10
// //     ### 표정훈
// //     ### MyList 삭제
// //     */
// //   @Delete('/:collectionId')
// //   @ApiOkResponse({
// //     description: 'MyList 삭제',
// //   })
// //   @ApiUnauthorizedResponse({ description: 'MyList 삭제실패' })
// //   async deleteMyList(@Param('collectionId') collectionId: number) {
// //     return this.myListService.deleteMyList(collectionId);
// //   }

// //   /*
// //     ### 23.03.10
// //     ### 표정훈
// //     ### MyList 포스팅 추가
// //     */
// //   @Post('/:collectionId')
// //   @ApiOkResponse({
// //     description: 'MyList 포스팅 추가',
// //   })
// //   @ApiUnauthorizedResponse({ description: 'MyList 포스팅 추가 실패' })
// //   async myListPlusPosting(@Param('collectionId') collectionId: number) {
// //     const postId = 1;
// //     return this.myListService.myListPlusPosting(postId, collectionId);
// //   }

// // }

// // }
// // //   @Post('/:userId')
// //   //   createMyList(@Param('userId') userId: number, @Body() data: CreateMyListDto) {
// //   //     // const userId = req.header.cookie
// //   //     return this.myListService.createMyList(
// //   //       userId,
// //   //       data.name,
// //   //       data.description,
// //   //       data.img,
// //   //     );
// //   //   }
// //   //   /*
// //   //     ### 23.03.10
// //   //     ### 표정훈
// //   //     ### MyList 수정
// //   //     */
// //   //   @Put('/:myListId')
// //   //   async updateMyList(
// //   //     @Param('myListId') myListId: number,
// //   //     @Body() data: UpdateMyListDto,
// //   //   ) {
// //   //     return this.myListService.updateMyList(
// //   //       myListId,
// //   //       data.name,
// //   //       data.description,
// //   //       data.img,
// //   //     );
// //   //   }
// //   //   /*
// //   //     ### 23.03.09
// //   //     ### 최호인
// //   //     ### MyList 삭제
// //   //     */
// //   //   @Delete('/:myListId')
// //   //   async deletePost(@Param('myListId') myListId: number) {
// //   //     return this.myListService.deleteMyList(myListId);
// //   //   }
