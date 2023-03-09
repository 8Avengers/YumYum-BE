import { Controller, Delete, Param, Post } from '@nestjs/common/decorators';
import { BookmarkService } from './bookmark.service';

@Controller('bookmarks')
export class BookmarkController {
  constructor(private readonly bookmarkService: BookmarkService) {}

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
