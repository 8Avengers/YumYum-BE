import { UpdateCollectionDto } from './dto/update-bookmarkCollection.dto';
import { CreateCollectionDto } from './dto/create-bookmarkCollection.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CollectionService } from './bookmark-collection.service';

@Controller('collections')
export class CollectionController {
  constructor(private readonly collectionService: CollectionService) {}

  /*
    ### 23.03.08
    ### 표정훈
    ### 컬렉션 전체 보기
    */
  @Get()
  async getBookmarks() {
    const bookmarks = await this.collectionService.getBookmarks();
    return await bookmarks;
  }

  /*
    ### 23.03.08
    ### 표정훈
    ### 컬렉션 상세 보기
    */
  @Get('/:collectionId')
  async getCollections(@Param('collectionId') collectionId: number) {
    const collections = await this.collectionService.getCollections(
      collectionId,
    );
    return await collections;
  }

  /*
    ### 23.03.08
    ### 표정훈
    ### 컬렉션 생성
    */
  @Post()
  createCollection(@Body() data: CreateCollectionDto) {
    return this.collectionService.createCollection(data.name);
  }

  /*
    ### 23.03.08
    ### 표정훈
    ### 컬렉션 수정
    */
  @Put('/:collectionId')
  async updateCollection(
    @Param('collectionId') collectionId: number,
    @Body() data: UpdateCollectionDto,
  ) {
    return await this.collectionService.updateCollection(
      collectionId,
      data.name,
    );
  }

  /*
    ### 23.03.08
    ### 표정훈
    ### 컬렉션 삭제
    */
  @Delete('/:collectionId')
  async deleteCollection(@Param('collectionId') collectionId: number) {
    return await this.collectionService.deleteCollection(collectionId);
  }
}
