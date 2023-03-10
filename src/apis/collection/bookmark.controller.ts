import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UseGuards,
  Param,
  Delete,
  Put,
  Get
} from '@nestjs/common';

import { BookmarkService } from './bookmark.service';
import { CreateCollectionDto } from './dto/create-collection.dto';

@Controller('bookmarks')
export class BookmarkController {
  constructor(private readonly bookmarkService: BookmarkService) {}

  /*
    ### 23.03.08
    ### 표정훈
    ### 컬렉션 전체 보기
    */
  @Get()
  async getBookmarks() {
    const bookmarks = await this.bookmarkService.getBookmarks();
    return await bookmarks;
  }

  /*
      ### 23.03.08
      ### 표정훈
      ### 컬렉션 상세 보기
      */
  @Get('/:collectionId')
  async getCollections(@Param('collectionId') collectionId: number) {
    const collections = await this.bookmarkService.getCollections(collectionId);
    return await collections;
  }

  /*
      ### 23.03.08
      ### 표정훈
      ### 컬렉션 생성
      */
  @Post()
  createCollection(
    @Body() data:CreateCollectionDto) {
    return this.bookmarkService.createCollection(data);
  }

  /*
      ### 23.03.08
      ### 표정훈
      ### 컬렉션 수정
      */
  @Put('/:collectionId')
  async updateCollection(
    @Param('collectionId') collectionId: number,
    @Body() name: string,
  ) {
    return await this.bookmarkService.updateCollection(collectionId, name);
  }

  /*
      ### 23.03.08
      ### 표정훈
      ### 컬렉션 삭제
      */
  @Delete('/:collectionId')
  async deleteCollection(@Param('collectionId') collectionId: number) {
    return await this.bookmarkService.deleteCollection(collectionId);
  }

  /*
    ### 23.03.08
    ### 표정훈
    ### 컬렉션에 포스팅 더하기
    */
  @Post('/:collectionId/:postId')
  async collectionPlusPosting(
    @Param('collectionId') collectionId: number,
    @Param('postId') postId: number,
  ) {
    return await this.bookmarkService.collectionPlusPosting(
      collectionId,
      postId,
    );
  }

  /*
      ### 23.03.08
      ### 표정훈
      ### 컬렉션에 맛집 더하기
      */
  @Post('/:collectionId/:restaurantId')
  async collectionPlusRestaurant(
    @Param('collectionId') collectionId: number,
    @Param('restaurantId') restaurantId: number,
  ) {
    return await this.bookmarkService.collectionPlusRestaurant(
      collectionId,
      restaurantId,
    );
  }

  /*
      ### 23.03.08
      ### 표정훈
      ### 컬렉션에 포스팅 빼기
      */
  @Delete('/:collectionId/:postId')
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
      ### 23.03.08
      ### 표정훈
      ### 컬렉션에 맛집 빼기
      */
  @Delete('/:collectionId/:restaurantId')
  async collectionMinusRestaurant(
    @Param('collectionId') collectionId: number,
    @Param('restaurantId') restaurantId: number,
  ) {
    return await this.bookmarkService.collectionMinusRestaurant(
      collectionId,
      restaurantId,
    );
  }
}
