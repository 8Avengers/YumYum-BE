import { Controller, Post, Get, Put, Delete } from '@nestjs/common';
import { Body, Param, UseGuards } from '@nestjs/common/decorators';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UpdateMyListDto } from './dto/create-my-list.dto';
import { CreateMyListDto } from './dto/update-my-list.dto';
import { MyListService } from './my-list.service';

@Controller('myList')
export class MyListController {
  constructor(private readonly myListService: MyListService) {}
  /*
    ### 23.03.10
    ### 표정훈
    ### MyList 전체조회
    */
  // @UseGuards(AuthGuard('local'))
  @Get('/:userId')
  @ApiOkResponse({
    description: 'MyList 전체조회',
  })
  @ApiUnauthorizedResponse({ description: '전체조회 실패' })
  async getMyLists(@Param('userId') userId: number) {
    const myLists = await this.myListService.getMyList(userId);
    return await myLists;
  }

  /*
    ### 23.03.10
    ### 표정훈
    ### MyList 생성
    */
  // @UseGuards(AuthGuard('local'))
  @Post('/:userId')
  @ApiCreatedResponse({
    description: 'MyList 생성완료',
  })
  @ApiUnauthorizedResponse({ description: 'MyList 생성실패' })
  createMyList(@Param('userId') userId: number, @Body() data: CreateMyListDto) {
    return this.myListService.createMyList(
      userId,
      data.name,
      data.description,
      data.image,
    );
  }
  /*
    ### 23.03.10
    ### 표정훈
    ### MyList 수정
    */
  @Put('/:myListId')
  @ApiOkResponse({
    description: 'MyList 수정',
  })
  @ApiUnauthorizedResponse({ description: 'MyList 수정실패' })
  async updateMyList(
    @Param('myListId') myListId: number,
    @Body() data: UpdateMyListDto,
  ) {
    return this.myListService.updateMyList(
      myListId,
      data.name,
      data.description,
      data.img,
    );
  }
  /*
    ### 23.03.10
    ### 표정훈
    ### MyList 삭제
    */
  @Delete('/:myListId')
  @ApiOkResponse({
    description: 'MyList 삭제',
  })
  @ApiUnauthorizedResponse({ description: 'MyList 삭제실패' })
  async deletePost(@Param('myListId') myListId: number) {
    return this.myListService.deleteMyList(myListId);
  }
}
