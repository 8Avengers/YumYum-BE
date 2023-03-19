import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Get,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { AuthAccessGuard } from '../auth/guards/auth.guards';
import { BookmarkService } from './bookmark.service';
import { BookmarPostDto } from './dto/bookmark-post.dto';
import { BookmarRastaurantDto } from './dto/bookmark-restaurant.dto';
import { CreateCollectionDto } from './dto/create-bookmark.dto';

@Controller('bookmarks')
export class BookmarkController {
  constructor(private readonly bookmarkService: BookmarkService) {}

  /*
    ### 23.03.13
    ### 표정훈
    ### 컬렉션 전체 보기🔥
    */

  @Get('/collections')
  @UseGuards(AuthAccessGuard)
  @ApiOperation({ summary: '북마크 전체조회' })
  @ApiResponse({ status: 200, description: '북마크 전체조회 성공' })
  @ApiResponse({ status: 400, description: '북마크 전체조회 실패' })
  async getBookmarks(@CurrentUser() currentUser: any) {
    const bookmarks = await this.bookmarkService.getBookmarks(currentUser.id);
    return await bookmarks;
  }

  /*
      ### 23.03.13
      ### 표정훈
      ### 컬렉션 상세 보기🔥
      */
  @Get('/collections/:collectionId')
  @UseGuards(AuthAccessGuard)
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
  @UseGuards(AuthAccessGuard)
  @ApiOperation({ summary: '북마크 컬렉션 생성' })
  @ApiResponse({ status: 200, description: '북마크 컬렉션 생성 성공' })
  @ApiResponse({ status: 400, description: '북마크 컬렉션 생성 실패' })
  async createCollection(
    @Body() data: CreateCollectionDto,
    @CurrentUser() currentUser: any,
  ) {
    return await this.bookmarkService.createCollection(
      currentUser.id,
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
  @UseGuards(AuthAccessGuard)
  @ApiOperation({ summary: '북마크 컬렉션 수정' })
  @ApiResponse({ status: 200, description: '북마크 컬렉션 수정 성공' })
  @ApiResponse({ status: 400, description: '북마크 컬렉션 수정 실패' })
  async updateCollection(
    @Param('collectionId') collectionId: number,
    @Body('name') name: string,
  ) {
    return await this.bookmarkService.updateCollection(collectionId, name);
  }

  /*
      ### 23.03.13
      ### 표정훈
      ### 컬렉션 삭제🔥
      */
  @Delete('/collections/:collectionId')
  @UseGuards(AuthAccessGuard)
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
  @Post('/collections/plus/post/:postId')
  @UseGuards(AuthAccessGuard)
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
  @UseGuards(AuthAccessGuard)
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

  @Post('/collections/plus/restaurant/:restaurantId')
  @UseGuards(AuthAccessGuard)
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
  @UseGuards(AuthAccessGuard)
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
