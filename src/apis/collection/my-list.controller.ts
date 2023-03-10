import { UpdateMyListDto } from './dto/update-my-list.dto';
import { Controller, Post, Get, Put, Delete } from '@nestjs/common';
import { Body, Param } from '@nestjs/common/decorators';
import { CreateMyListDto } from './dto/create-my-list.dto';
import { MyListService } from './my-list.service';

@Controller('myList')
export class MyListController {
  constructor(private readonly myListService: MyListService) {}
  /*
    ### 23.03.09
    ### 최호인
    ### MyList 불러오기
    */
  @Get('/')
  async getMyLists() {
    const userId = 1;
    return this.myListService.getMyList(userId);
  }

  /*
    ### 23.03.09
    ### 최호인
    ### MyList 생성
    */
  @Post('/')
  createMyList(@Body() data: CreateMyListDto) {
    // const userId = req.header.cookie
    const userId = 1;
    return this.myListService.createMyList(
      userId,
      data.name,
      data.description,
      data.img,
    );
  }
  /*
    ### 23.03.09
    ### 최호인
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

  @Delete('/:myListId')
  async deletePost(@Param('myListId') myListId: number) {
    return this.myListService.deleteMyList(myListId);
  }
}