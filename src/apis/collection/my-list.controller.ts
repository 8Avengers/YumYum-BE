import { Controller, Post, Get, Put, Delete } from '@nestjs/common';
import { Body, Param, UseGuards } from '@nestjs/common/decorators';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
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
  @Post('/collections/:collectionId')
  @ApiOperation({ summary: 'MyList 포스팅 추가' })
  @ApiResponse({ status: 200, description: 'MyList 포스팅 추가 성공' })
  @ApiResponse({ status: 400, description: 'MyList 포스팅 추가 실패' })
  async myListPlusPosting(@Param('collectionId') collectionId: number) {
    const postId = 1;
    return this.myListService.myListPlusPosting(postId, collectionId);
  }
}
