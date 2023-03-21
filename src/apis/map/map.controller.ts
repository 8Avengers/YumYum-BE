import { AuthAccessGuard } from './../auth/guards/auth.guards';
import { Body, Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { MapService } from './map.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { LocationRestaurantDto } from './dto/location-restaurant.dto';

@ApiTags('Map')
@Controller('map')
export class MapController {
  constructor(private readonly mapService: MapService) {}

  @ApiOperation({ summary: '맵 탐색 페이지' })
  @UseGuards(AuthAccessGuard)
  @Get('/followerPosting')
  async getFollowerSearchInMap(@CurrentUser() currentUser: any) {
    return await this.mapService.getFollowerPosting(currentUser.id);
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
    return await this.mapService.getMyPosting(currentUser.id, collectionId);
  }

  @ApiOperation({ summary: '메인 페이지' })
  @Get('/main/near-restaurant')
  async getCloseRestaurant(@Body() data: Partial<LocationRestaurantDto>) {
    return await this.mapService.getNearRestaurant(data.x, data.y);
  }
}
