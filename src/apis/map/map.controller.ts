import { AuthAccessGuard } from './../auth/guards/auth.guards';
import { Body, Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { MapService } from './map.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Map')
@Controller('map')
export class MapController {
  constructor(private readonly mapService: MapService) {}

  @ApiOperation({ summary: '맵 탐색 페이지1' })
  @UseGuards(AuthAccessGuard)
  @Get('/following-posting')
  async getFollowerSearchInMap(
    @Query('type') type: string,
    @CurrentUser() currentUser: any,
  ) {
    return await this.mapService.getFollowerPosting(currentUser.id, type);
  }

  @ApiOperation({ summary: '맵 탐색 페이지 리스트' })
  @UseGuards(AuthAccessGuard)
  @Get('/follower-posting-list')
  async getFollowerSearchInMapList(@CurrentUser() currentUser: any) {
    return await this.mapService.getFollowerPostingList(currentUser.id);
  }

  @ApiOperation({ summary: '내 포스팅 지도' })
  @UseGuards(AuthAccessGuard)
  @Get('/myListPosting/:collectionId')
  async getMyPostingSearchInMap(
    @Param('collectionId') collectionId: number,
    @CurrentUser() currentUser: any,
  ) {
    return await this.mapService.getMyCollectionPosting(
      currentUser.id,
      collectionId,
    );
  }
  @ApiOperation({ summary: '내 포스팅 지도' })
  @Get('/user-posting/:userId')
  async getUserPostingSearchInMap(@Param('userId') userId: number) {
    return await this.mapService.getUserPosting(userId);
  }
}
