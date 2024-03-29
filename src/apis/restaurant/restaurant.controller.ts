import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RestaurantService } from './restaurant.service';

@ApiTags('Restaurant')
@Controller('restaurant')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @ApiOperation({ summary: '가게 상세 데이터 받기' })
  @Get('/:kakao_place_id')
  async getRestaurantDetails(@Param('kakao_place_id') kakao_place_id: string) {
    const restaurantDetails = await this.restaurantService.getRestaurantDetails(
      kakao_place_id,
    );

    return restaurantDetails;
  }

  @ApiOperation({ summary: '가게 데이터 저장하기' })
  @Post('/createRestaurant')
  async createRestaurant(@Body() data: CreateRestaurantDto) {
    return this.restaurantService.createRestaurant(
      data.address_name,
      data.category_group_code,
      data.category_group_name,
      data.category_name,
      data.id,
      data.phone,
      data.place_name,
      data.road_address_name,
      data.x,
      data.y,
    );
  }

  @ApiOperation({ summary: '가게 데이터 수정하기' })
  @Put('/updateRestaurant')
  async updateRestaurant(@Body() data: UpdateRestaurantDto) {
    return this.restaurantService.updateRestaurant(
      data.address_name,
      data.category_group_code,
      data.category_group_name,
      data.category_name,
      data.id,
      data.phone,
      data.place_name,
      data.road_address_name,
      data.x,
      data.y,
    );
  }

  @ApiOperation({ summary: '가게 데이터 지우기' })
  @Delete('/deleteRestaurant/:kakao_place_id')
  async deleteRestaurant(@Param('kakao_place_id') kakao_place_id: string) {
    return this.restaurantService.deleteRestaurant(kakao_place_id);
  }

  @ApiOperation({ summary: '메인 페이지 주변 맛집' })
  @Get('/main/near-restaurant')
  async getCloseRestaurant(@Query('x') x: string, @Query('y') y: string) {
    return await this.restaurantService.getNearRestaurant(x, y);
  }

  @ApiOperation({ summary: '가게 관련 포스트 ' })
  @Get('/restaurant-detail/related-posting')
  async getRelatedRestaurant(
    @Query('kakao_place_id') kakao_place_id: string,
    @Query('page') page: string,
  ) {
    return await this.restaurantService.getRelatedRestaurant(
      kakao_place_id,
      page,
    );
  }
}
