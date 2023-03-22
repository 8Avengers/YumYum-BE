import { minusCollectionPostingDto } from './dto/minus-bookmark-posting.dto';

import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  UseInterceptors,
  UploadedFile,
  ValidationPipe,
} from '@nestjs/common';
import { Body, Param, Query, UseGuards } from '@nestjs/common/decorators';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CreateMyListDto } from './dto/create-my-list.dto';
import { UpdateMyListDto } from './dto/update-my-list.dto';
import { MyListService } from './my-list.service';
import { addCollectionPostingDto } from './dto/add-my-list-posting.dto';
import { AuthAccessGuard } from '../auth/guards/auth.guards';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { DetailMylistDto } from './dto/my-list.detail.dto';
import { PostService } from '../post/post.service';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('my-list')
@Controller('my-list')
export class MyListController {
  constructor(
    private readonly myListService: MyListService,
    private readonly postService: PostService,
  ) {}

  /*
    ### 23.03.19
    ### 표정훈
    ### MyList 상세보기!
    */
  @Get('/collections/detail/:collectionId')
  @ApiOperation({ summary: 'MyList 상세보기' })
  @ApiResponse({ status: 200, description: 'MyList 상세보기 성공' })
  @ApiResponse({ status: 400, description: 'MyList 상세보기 실패' })
  async getMyListDetail(
    @Param('collectionId') collectionId: number,
    @Query('page') page: string,
  ) {
    const myLists = await this.myListService.getMyListDetail(
      collectionId,
      page,
    );
    return await myLists;
  }

  /*
    ### 23.03.20
    ### 표정훈/이드보라
    ### MyList 상세 더보기(동일한 포스트 불러오기) 🔥
    */
  @Get('/collections/detail/posts/:collectionId/:restaurantId')
  @UseGuards(AuthAccessGuard)
  @ApiOperation({ summary: 'MyList 상세 더보기' })
  @ApiResponse({ status: 200, description: 'MyList 상세 더보기 성공' })
  @ApiResponse({ status: 400, description: 'MyList 상세 더보기 실패' })
  async getMyListsDetailPost(
    @Param('restaurantId') restaurantId: number,
    @Param('collectionId') collectionId: number,
    @CurrentUser() currentUser: any,
    @Query('page') page: string,
  ) {
    const myLists = await this.myListService.getMyListsDetailPost(
      currentUser.id,
      restaurantId,
      collectionId,
      page,
    );
    return await myLists;
  }

  /*
    ### 23.03.14
    ### 표정훈
    ### MyList 이름조회(내꺼)
    */

  @Get('/collections/name')
  @UseGuards(AuthAccessGuard)
  @ApiOperation({ summary: 'MyList 이름조회(내꺼)' })
  @ApiResponse({ status: 200, description: 'MyList 이름조회(내꺼) 성공' })
  @ApiResponse({ status: 400, description: 'MyList 이름조회(내꺼) 실패' })
  async getMyListsName(@CurrentUser() currentUser: any) {
    const myLists = await this.myListService.getMyListsName(currentUser.id);
    return await myLists;
  }

  /*
    ### 23.03.14
    ### 표정훈
    ### MyList 전체조회(내꺼)
    */

  @Get('/collections')
  @UseGuards(AuthAccessGuard)
  @ApiOperation({ summary: 'MyList 전체조회(내꺼)' })
  @ApiResponse({ status: 200, description: 'MyList 전체조회(내꺼) 성공' })
  @ApiResponse({ status: 400, description: 'MyList 전체조회(내꺼) 실패' })
  async getMyListsMe(
    @CurrentUser() currentUser: any,
    @Query('page') page: string,
  ) {
    const myLists = await this.myListService.getMyListsMe(currentUser.id, page);
    return await myLists;
  }

  /*
    ### 23.03.10
    ### 표정훈
    ### MyList 전체조회(남의 전체조회)
    */

  @Get('/collections/:userId')
  @ApiOperation({ summary: 'MyList 전체조회(남의꺼)' })
  @ApiResponse({ status: 200, description: 'MyList 전체조회 성공' })
  @ApiResponse({ status: 400, description: 'MyList 전체조회 실패' })
  async getMyListsAll(
    @Param('userId') userId: number,
    @Query('page') page: string,
  ) {
    const myLists = await this.myListService.getMyListsAll(userId, page);
    return await myLists;
  }
  /*
    ### 23.03.10
    ### 표정훈
    ### MyList 생성
    */
  @Post('/collections')
  @UseGuards(AuthAccessGuard)
  @ApiOperation({ summary: 'MyList 생성' })
  @ApiResponse({ status: 200, description: 'MyList 생성 성공' })
  @ApiResponse({ status: 400, description: 'MyList 생성 실패' })
  async createMyList(
    @Body() data: CreateMyListDto,
    @CurrentUser() currentUser: any,
  ) {
    return await this.myListService.createMyList(
      currentUser.id,
      data.name,
      data.type,
    );
  }

  /*
    ### 23.03.20
    ### 표정훈
    ### MyList 수정조회
    */

  @Get('/collections/update/:collectionId')
  @UseGuards(AuthAccessGuard)
  @ApiOperation({ summary: 'MyList 수정조회' })
  @ApiResponse({ status: 200, description: 'MyList 수정조회 성공' })
  @ApiResponse({ status: 400, description: 'MyList 수정조회 실패' })
  async getMyListInfo(
    // @Param('userId') userId: number,
    @Param('collectionId') collectionId: number,
  ) {
    return this.myListService.getMyListInfo(collectionId);
  }

  /*
    ### 23.03.10
    ### 표정훈
    ### MyList 수정 
    */

  @Put('/collections/:collectionId')
  @UseGuards(AuthAccessGuard)
  @ApiOperation({ summary: 'MyList 수정' })
  @ApiResponse({ status: 200, description: 'MyList 수정 성공' })
  @ApiResponse({ status: 400, description: 'MyList 수정 실패' })
  @UseInterceptors(FileInterceptor('file')) //이미지관련
  async updateMyList(
    // @Param('userId') userId: number,
    @Param('collectionId') collectionId: number,
    @UploadedFile() file: Express.Multer.File,
    @Body(ValidationPipe) data: UpdateMyListDto,
    @CurrentUser() currentUser: any,
  ) {
    const updateMyList = await this.myListService.updateMyList(
      currentUser.id,
      collectionId,
      data.name,
      data.image,
      data.description,
      data.visibility,
      file,
    );
    const result = {
      name: updateMyList.name,
      image: updateMyList.image,
      description: updateMyList.description,
      visibility: updateMyList.visibility,
    };
    return result;
  }

  /*
    ### 23.03.10
    ### 표정훈
    ### MyList 삭제
    */
  @Delete('/collections/:collectionId')
  @UseGuards(AuthAccessGuard)
  @ApiOperation({ summary: 'MyList 삭제' })
  @ApiResponse({ status: 200, description: 'MyList 삭제 성공' })
  @ApiResponse({ status: 400, description: 'MyList 삭제 실패' })
  async deleteMyList(
    @Param('collectionId') collectionId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.myListService.deleteMyList(collectionId);
  }

  /*
    ### 23.03.10
    ### 표정훈
    ### MyList 포스팅 추가
    */
  @Post('/collections/plus/:postId')
  @UseGuards(AuthAccessGuard)
  @ApiOperation({ summary: 'MyList 포스팅 추가' })
  @ApiResponse({ status: 200, description: 'MyList 포스팅 추가 성공' })
  @ApiResponse({ status: 400, description: 'MyList 포스팅 추가 실패' })
  async myListPlusPosting(
    @Param('postId') postId: number,
    @Body() data: addCollectionPostingDto,
  ) {
    return this.myListService.myListPlusPosting(postId, data.collectionId);
  }

  /*
    ### 23.03.13
    ### 표정훈
    ### MyList 포스팅 삭제
    */
  @Delete('/collections/minus/:postId')
  @UseGuards(AuthAccessGuard)
  @ApiOperation({ summary: 'MyList 포스팅 삭제' })
  @ApiResponse({ status: 200, description: 'MyList 포스팅 삭제 성공' })
  @ApiResponse({ status: 400, description: 'MyList 포스팅 삭제 실패' })
  async myListMinusPosting(
    @Param('postId') postId: number,
    @Body() data: minusCollectionPostingDto,
    @CurrentUser() currentUser: any,
  ) {
    return await this.myListService.myListMinusPosting(
      postId,
      data.collectionId,
    );
  }

  /*
    ### 23.03.17
    ### 표정훈
    ### MyList 포스팅 업데이트🔥
    */
  @Post('/collections/update/:postId')
  @UseGuards(AuthAccessGuard)
  @ApiOperation({ summary: 'MyList 포스팅 업데이트' })
  @ApiResponse({ status: 200, description: 'MyList 포스팅 업데이트 성공' })
  @ApiResponse({ status: 400, description: 'MyList 포스팅 업데이트 실패' })
  async myListUpdatePosting(
    @Param('postId') postId: number,
    @Body() data: addCollectionPostingDto,
  ) {
    return this.myListService.myListUpdatePosting(postId, data.collectionId);
  }

  /*
    ### 23.03.20
    ### 표정훈
    ### [Main] 요즘 뜨는 맛집리스트🔥
    */
  @Get('/collections/main/hot')
  @ApiOperation({ summary: '요즘 뜨는 맛집리스트' })
  @ApiResponse({ status: 200, description: '요즘 뜨는 맛집리스트 성공' })
  @ApiResponse({ status: 400, description: '요즘 뜨는 맛집리스트 실패' })
  async HotMyList() {
    return this.myListService.HotMyList();
  }

  /*
    ### 23.03.21
    ### 표정훈
    ### 내 친구의 맛집리스트
    */
  @Get('/collections/main/followers')
  @UseGuards(AuthAccessGuard)
  @ApiOperation({ summary: '내 친구의 맛집리스트' })
  @ApiResponse({ status: 200, description: '내 친구의 맛집리스트 성공' })
  @ApiResponse({ status: 400, description: '내 친구의 맛집리스트 실패' })
  async FollowersMyList(@CurrentUser() currentUser: any) {
    //애니는 안된다. dto필요해!
    return this.myListService.FollowersMyList(currentUser.id);
  }
}
