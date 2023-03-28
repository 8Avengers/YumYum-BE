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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { AuthAccessGuard } from '../auth/guards/auth.guards';
import { BookmarkService } from './bookmark.service';
import { BookmarPostDto } from './dto/bookmark-post.dto';
import { BookmarRastaurantDto } from './dto/bookmark-restaurant.dto';
import { CreateCollectionDto } from './dto/create-bookmark.dto';

@ApiTags('bookmarks')
@Controller('bookmarks')
export class BookmarkController {
  constructor(private readonly bookmarkService: BookmarkService) {}

  /*
    ### 23.03.22
    ### 표정훈
    ### 북마크 선택시 API (만들어야함)🔥
    get: bookmarks/:postId
    0) API추가
        1. 내가 가지고 있는 각각 컬렉션에서 해당 postId를 가지고 있는지
        [{id:36, name: "", image: "", hasPost: false}]  <== 킹보라?킹호인?
        2. 취소할 때는 이미 만들어 놓은 컬렉션에서 포스트 삭제 함수 사용
    */

  /*
    ### 23.03.22
    ### 표정훈
    ### 북마크 전체 보기
    */

  @Get('/collections')
  @UseGuards(AuthAccessGuard)
  @ApiOperation({ summary: '북마크 전체조회' })
  @ApiResponse({ status: 200, description: '북마크 전체조회 성공' })
  @ApiResponse({ status: 400, description: '북마크 전체조회 실패' })
  async getBookmarks(@CurrentUser() currentUser: any) {
    const bookmarks = await this.bookmarkService.getBookmarks(currentUser.id);
    return bookmarks;
  }

  /*
      ### 23.03.13
      ### 표정훈
      ### 북마크 생성
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
      data.visibility,
    );
  }

  /*
      ### 23.03.13
      ### 표정훈
      ### 북마크 수정
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
      ### 북마크 삭제
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
      ### 23.03.22
      ### 표정훈
      ### 북마크 상세 보기
      */
  @Get('/collections/detail/:collectionId')
  @UseGuards(AuthAccessGuard)
  @ApiOperation({ summary: '북마크 상세조회' })
  @ApiResponse({ status: 200, description: '북마크 상세조회 성공' })
  @ApiResponse({ status: 400, description: '북마크 상세조회 실패' })
  async getCollections(@Param('collectionId') collectionId: number) {
    const collections = await this.bookmarkService.getCollections(collectionId);
    return await collections;
  }

  /*
    ### 23.03.29
    ### 표정훈
    ### 기본 북마크에 포스팅 삭제
    */

  @Delete('/collections/post/:postId')
  @UseGuards(AuthAccessGuard)
  @ApiOperation({ summary: '북마크 포스팅 삭제' })
  @ApiResponse({ status: 200, description: '북마크 포스팅 삭제 성공' })
  @ApiResponse({ status: 400, description: '북마크 포스팅 삭제 실패' })
  async basicCollectionMinusPosting(
    @Param('postId') postId: number,
    @CurrentUser() currentUser: any,
  ) {
    return await this.bookmarkService.basicCollectionMinusPosting(
      postId,
      currentUser.id,
    );
  }

  /*
    ### 23.03.29
    ### 표정훈
    ### 기본 북마크에 포스팅 더하기 
    */

  @Post('/collections/post/:postId')
  @UseGuards(AuthAccessGuard)
  @ApiOperation({ summary: '북마크 포스팅 추가' })
  @ApiResponse({ status: 200, description: '북마크 포스팅 추가 성공' })
  @ApiResponse({ status: 400, description: '북마크 포스팅 추가 실패' })
  async basicCollectionPlusPosting(
    @Param('postId') postId: number,
    @CurrentUser() currentUser: any,
  ) {
    return await this.bookmarkService.basicCollectionPlusPosting(
      postId,
      currentUser.id,
    );
  }

  /*
      ### 23.03.22
      ### 표정훈
      ### 북마크에 포스팅 빼기
      */
  @Delete('/collections/:collectionId/post/:postId')
  @UseGuards(AuthAccessGuard)
  @ApiOperation({ summary: '북마크 포스팅 삭제' })
  @ApiResponse({ status: 200, description: '북마크 포스팅 삭제 성공' })
  @ApiResponse({ status: 400, description: '북마크 포스팅 삭제 실패' })
  async collectionMinusPosting(
    @Param('collectionId') collectionId: number,
    @Param('postId') postId: number,
  ) {
    return await this.bookmarkService.collectionMinusPosting(
      collectionId,
      postId,
    );
  }

  /*
      ### 23.03.22
      ### 표정훈
      ### 북마크에 포스팅 더하기
      */

  @Post('/collections/:collectionId/post/:postId')
  @UseGuards(AuthAccessGuard)
  @ApiOperation({ summary: '북마크 포스팅 추가' })
  @ApiResponse({ status: 200, description: '북마크 포스팅 추가 성공' })
  @ApiResponse({ status: 400, description: '북마크 포스팅 추가 실패' })
  async collectionPlusPosting(
    @Param('collectionId') collectionId: number,
    @Param('postId') postId: number,
  ) {
    return await this.bookmarkService.collectionPlusPosting(
      collectionId,
      postId,
    );
  }
}
