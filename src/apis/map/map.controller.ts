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
  //   @UseGuards(AuthAccessGuard)
  @Get('/posting')
  async getUserSearch() {
    // @CurrentUser() currentUser: any
    const userId = 5;
    return await this.mapService.getFollowerPosting(userId);
  }
}
