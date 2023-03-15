import { AuthAccessGuard } from './../auth/guards/auth.guards';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { MapService } from './map.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Map')
@Controller('map')
export class MapController {
  constructor(private readonly mapService: MapService) {}

  @ApiOperation({ summary: '맵 탐색 페이지' })
  @UseGuards(AuthAccessGuard)
  @Get('/posting')
  async getFollowerSearchInMap(@CurrentUser() currentUser: any) {
    const userId = 5;
    return await this.mapService.getFollowerPosting(userId);
  }

  @ApiOperation({ summary: '내 포스팅 지도' })
  // @UseGuards(AuthAccessGuard)
  @Get('/myPosting')
  async getMyPostingSearchInMap() {
    // @CurrentUser() currentUser: any
    const userId = 11;
    return await this.mapService.getMyPosting(userId);
  }
}
