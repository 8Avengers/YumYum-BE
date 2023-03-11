import { Controller, Post, Get, Put, Delete } from '@nestjs/common';
import { Body, Param, UseGuards } from '@nestjs/common/decorators';
import { UpdateMyListDto } from './dto/create-my-list.dto';
import { CreateMyListDto } from './dto/update-my-list.dto';
import { MyListService } from './my-list.service';
import { AuthAccessGuard, AuthRefreshGuard } from '../auth/guards/auth.guards';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

@Controller('my-list')
export class MyListController {
  constructor(private readonly myListService: MyListService) {}
  /*
    ### 23.03.10
    ### 표정훈
    ### MyList 불러오기
    */

  // @UseGuards(AuthAccessGuard)
  // @UseGuards(AuthRefreshGuard)
  @Get('')
  async getMyLists() {
    console.log('현재유저찍어보자 getMyList에서');

    return 'myLists';

    // @CurrentUser() currentUser: any, //

    // const myLists = await this.myListService.getMyList({ user: currentUser });
  }

  /*
    ### 23.03.10
    ### 표정훈
    ### MyList 생성
    */
  //   @Post('/:userId')
  //   createMyList(@Param('userId') userId: number, @Body() data: CreateMyListDto) {
  //     // const userId = req.header.cookie
  //     return this.myListService.createMyList(
  //       userId,
  //       data.name,
  //       data.description,
  //       data.img,
  //     );
  //   }
  //   /*
  //     ### 23.03.10
  //     ### 표정훈
  //     ### MyList 수정
  //     */
  //   @Put('/:myListId')
  //   async updateMyList(
  //     @Param('myListId') myListId: number,
  //     @Body() data: UpdateMyListDto,
  //   ) {
  //     return this.myListService.updateMyList(
  //       myListId,
  //       data.name,
  //       data.description,
  //       data.img,
  //     );
  //   }
  //   /*
  //     ### 23.03.09
  //     ### 최호인
  //     ### MyList 삭제
  //     */
  //   @Delete('/:myListId')
  //   async deletePost(@Param('myListId') myListId: number) {
  //     return this.myListService.deleteMyList(myListId);
  //   }
}
