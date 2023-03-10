import { Controller, Post, Get, Put, Delete } from '@nestjs/common';
import { Body, Param } from '@nestjs/common/decorators';
import { UpdateMyListDto } from './dto/create-my-list.dto';
import { CreateMyListDto } from './dto/update-my-list.dto';
import { MyListService } from './my-list.service';

@Controller('myList')
export class MyListController {
  constructor(private readonly myListService: MyListService) {}
  /*
    ### 23.03.10
    ### 표정훈
    ### MyList 불러오기
    */
  //use가드
  @Get('/:userId')
  async getMyLists(@Param('userId') userId: number) {
    const myLists = await this.myListService.getMyList(userId);
    return await myLists;
  }

  /*
    ### 23.03.10
    ### 표정훈
    ### MyList 생성
    */
  @Post('/:userId')
  createMyList(@Param('userId') userId: number, @Body() data: CreateMyListDto) {
    // const userId = req.header.cookie
    return this.myListService.createMyList(
      userId,
      data.name,
      data.description,
      data.img,
    );
  }
  /*
    ### 23.03.10
    ### 표정훈
    ### MyList 수정
    */
  @Put('/:myListId')
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
    ### 23.03.09
    ### 최호인
    ### MyList 삭제
    */
  @Delete('/:myListId')
  async deletePost(@Param('myListId') myListId: number) {
    return this.myListService.deleteMyList(myListId);
  }
}
