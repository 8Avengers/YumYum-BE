import { Controller, Post, Get, Put, Delete } from '@nestjs/common';
import { Body, Param, UseGuards } from '@nestjs/common/decorators';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CreateCollectionPostingDto } from './dto/create-collection-posting.dto';
import { CreateMyListDto } from './dto/create-my-list.dto';
import { UpdateMyListDto } from './dto/update-my-list.dto';
import { MyListService } from './my-list.service';

@Controller('my-list')
export class MyListController {
  constructor(private readonly myListService: MyListService) {}
  /*
    ### 23.03.10
    ### 표정훈
    ### MyList 전체조회(해당 유저의 맛집리스트만 불러오기)
    */
  // @UseGuards(AuthGuard('local'))
  @Get('/collections')
  @ApiOperation({ summary: 'MyList 전체조회' })
  @ApiResponse({ status: 200, description: 'MyList 전체조회 성공' })
  @ApiResponse({ status: 400, description: 'MyList 전체조회 실패' })
  async getMyLists() {
    const userId = 1;
    const myLists = await this.myListService.getMyList(userId);
    return await myLists;
  }
  /*
    ### 23.03.10
    ### 표정훈
    ### MyList 생성
    */
  // @UseGuards(AuthGuard('local'))
  @Post('/collections')
  @ApiOperation({ summary: 'MyList 생성' })
  @ApiResponse({ status: 200, description: 'MyList 생성 성공' })
  @ApiResponse({ status: 400, description: 'MyList 생성 실패' })
  async createMyList(@Body() data: CreateMyListDto) {
    const userId = 1;
    return await this.myListService.createMyList(userId, data.name, data.type);
  }

  /*
    ### 23.03.10
    ### 표정훈
    ### MyList 수정
    */

  @Put('/collections/:collectionId')
  @ApiOperation({ summary: 'MyList 수정' })
  @ApiResponse({ status: 200, description: 'MyList 수정 성공' })
  @ApiResponse({ status: 400, description: 'MyList 수정 실패' })
  async updateMyList(
    // @Param('userId') userId: number,
    @Param('collectionId') collectionId: number,
    @Body() data: UpdateMyListDto,
  ) {
    const userId = 1;
    return this.myListService.updateMyList(
      userId,
      collectionId,
      data.name,
      data.image,
      data.description,
      data.visibility,
    );
  }
  /*
    ### 23.03.10
    ### 표정훈
    ### MyList 삭제
    */
  @Delete('/collections/:collectionId')
  @ApiOperation({ summary: 'MyList 삭제' })
  @ApiResponse({ status: 200, description: 'MyList 삭제 성공' })
  @ApiResponse({ status: 400, description: 'MyList 삭제 실패' })
  async deleteMyList(@Param('collectionId') collectionId: number) {
    return this.myListService.deleteMyList(collectionId);
  }

  /*
    ### 23.03.10
    ### 표정훈
    ### MyList 포스팅 추가
    */
  @Post('/collections/posting/')
  @ApiOperation({ summary: 'MyList 포스팅 추가' })
  @ApiResponse({ status: 200, description: 'MyList 포스팅 추가 성공' })
  @ApiResponse({ status: 400, description: 'MyList 포스팅 추가 실패' })
  async myListPlusPosting(@Body() data: CreateCollectionPostingDto) {
    const postId = 1;
    return this.myListService.myListPlusPosting(postId, data.collectionId);
  }
}

//일단 이거 커밋해서 푸쉬해야함

//1번문제 배열로 collectionId 받는거 해결🔥
//2번문제 collectionId가 없는 경우 에러문구 발생 해결🔥
//3번문제 전체조회에서 레스토랑 아이디를 가져오는 방법은 해결🔥(알아서 가져가신다함)
//4번문제 나의 맛집리스트 전체보기 PAGE 1페이지에서 최근 추가한 게시물 3개만 보여주세요.
