import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Get,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BookmarkService } from './bookmark.service';
import { BookmarPostDto } from './dto/bookmark-post.dto';
import { BookmarRastaurantDto } from './dto/bookmark-restaurant.dto';
import { CreateCollectionDto } from './dto/create-bookmark.dto';

@Controller('bookmarks')
export class BookmarkController {
  constructor(private readonly bookmarkService: BookmarkService) {}

  //현재 컬렉션 전체보기와 컬렉션 생성 완성 나머지 해야댐

  /*
    ### 23.03.13
    ### 표정훈
    ### 컬렉션 전체 보기🔥
    */

  // @UseGuards(AuthGuard('local'))
  @Get('/collections')
  @ApiOperation({ summary: '북마크 전체조회' })
  @ApiResponse({ status: 200, description: '북마크 전체조회 성공' })
  @ApiResponse({ status: 400, description: '북마크 전체조회 실패' })
  async getBookmarks() {
    const userId = 2;
    const bookmarks = await this.bookmarkService.getBookmarks(userId);
    return await bookmarks;
  }

  /*
      ### 23.03.13
      ### 표정훈
      ### 컬렉션 상세 보기🔥
      */
  @Get('/collections/:collectionId')
  @ApiOperation({ summary: '북마크 상세조회' })
  @ApiResponse({ status: 200, description: '북마크 상세조회 성공' })
  @ApiResponse({ status: 400, description: '북마크 상세조회 실패' })
  async getCollections(@Param('collectionId') collectionId: number) {
    const collections = await this.bookmarkService.getCollections(collectionId);
    return await collections;
  }

  /*
      ### 23.03.13
      ### 표정훈
      ### 컬렉션 생성🔥
      */
  @Post('/collections')
  @ApiOperation({ summary: '북마크 컬렉션 생성' })
  @ApiResponse({ status: 200, description: '북마크 컬렉션 생성 성공' })
  @ApiResponse({ status: 400, description: '북마크 컬렉션 생성 실패' })
  async createCollection(@Body() data: CreateCollectionDto) {
    const userId = 2;
    return await this.bookmarkService.createCollection(
      userId,
      data.name,
      data.type,
    );
  }

  /*
      ### 23.03.13
      ### 표정훈
      ### 컬렉션 수정🔥
      */

  @Put('/collections/:collectionId')
  @ApiOperation({ summary: '북마크 컬렉션 수정' })
  @ApiResponse({ status: 200, description: '북마크 컬렉션 수정 성공' })
  @ApiResponse({ status: 400, description: '북마크 컬렉션 수정 실패' })
  async updateCollection(
    @Param('collectionId') collectionId: number,
    @Body() name: string,
  ) {
    return await this.bookmarkService.updateCollection(collectionId, name);
  }

  /*
      ### 23.03.13
      ### 표정훈
      ### 컬렉션 삭제🔥
      */
  @Delete('/collections/:collectionId')
  @ApiOperation({ summary: '북마크 컬렉션 삭제' })
  @ApiResponse({ status: 200, description: '북마크 컬렉션 삭제 성공' })
  @ApiResponse({ status: 400, description: '북마크 컬렉션 삭제 실패' })
  async deleteCollection(@Param('collectionId') collectionId: number) {
    return await this.bookmarkService.deleteCollection(collectionId);
  }

  /*
    ### 23.03.13
    ### 표정훈
    ### 컬렉션에 포스팅 더하기🔥
    */
  @Post('/collections/add/post/:postId')
  @ApiOperation({ summary: '북마크 포스팅 추가' })
  @ApiResponse({ status: 200, description: '북마크 포스팅 추가 성공' })
  @ApiResponse({ status: 400, description: '북마크 포스팅 추가 실패' })
  async collectionPlusPosting(
    @Param('postId') postId: number,
    @Body() data: BookmarPostDto,
  ) {
    return await this.bookmarkService.collectionPlusPosting(
      data.collectionId,
      postId,
    );
  }

  /*
      ### 23.03.13
      ### 표정훈
      ### 컬렉션에 포스팅 빼기🔥
      */
  @Delete('/collections/minus/post/:postId')
  @ApiOperation({ summary: '북마크 포스팅 삭제' })
  @ApiResponse({ status: 200, description: '북마크 포스팅 삭제 성공' })
  @ApiResponse({ status: 400, description: '북마크 포스팅 삭제 실패' })
  async collectionMinusPosting(
    @Param('postId') postId: number,
    @Body() data: BookmarPostDto,
  ) {
    return await this.bookmarkService.collectionMinusPosting(
      data.collectionId,
      postId,
    );
  }

  /*
      ### 23.03.13
      ### 표정훈
      ### 컬렉션에 맛집 더하기🔥
      */

  @Post('/collections/add/restaurant/:restaurantId')
  @ApiOperation({ summary: '북마크 맛집 추가' })
  @ApiResponse({ status: 200, description: '북마크 맛집 추가 성공' })
  @ApiResponse({ status: 400, description: '북마크 맛집 추가 실패' })
  async collectionPlusRestaurant(
    @Param('restaurantId') restaurantId: number,
    @Body() data: BookmarRastaurantDto,
  ) {
    return await this.bookmarkService.collectionPlusRestaurant(
      data.collectionId,
      restaurantId,
    );
  }

  /*
        ### 23.03.13
        ### 표정훈
        ### 컬렉션에 맛집 빼기🔥
        */
  @Delete('/collections/minus/restaurant/:restaurantId')
  @ApiOperation({ summary: '북마크 맛집 삭제' })
  @ApiResponse({ status: 200, description: '북마크 맛집 삭제 성공' })
  @ApiResponse({ status: 400, description: '북마크 맛집 삭제 실패' })
  async collectionMinusRestaurant(
    @Param('restaurantId') restaurantId: number,
    @Body() data: BookmarRastaurantDto,
  ) {
    return await this.bookmarkService.collectionMinusRestaurant(
      data.collectionId,
      restaurantId,
    );
  }
}
