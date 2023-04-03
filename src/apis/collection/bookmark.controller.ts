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
    ### 23.03.29
    ### 표정훈
    ### 북마크 토글
    */
  @Get('/:postId')
  @UseGuards(AuthAccessGuard)
  @ApiOperation({ summary: '토글 선택' })
  @ApiResponse({ status: 200, description: '북마크 토글 성공' })
  @ApiResponse({ status: 400, description: '북마크 토글 실패' })
  async selectBookmark(
    @Param('postId') postId: number,
    @Body('collectionId') collectionId: number,
    @CurrentUser() currentUser: any,
  ) {
    return await this.bookmarkService.selectBookmark(
      postId,
      collectionId,
      currentUser.id,
    );
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
  async getCollections(
    @Param('collectionId') collectionId: number,
    @CurrentUser() currentUser: any,
  ) {
    const collections = await this.bookmarkService.getCollections(
      collectionId,
      currentUser.id,
    );
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
