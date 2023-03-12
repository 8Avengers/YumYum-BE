import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RestaurantService } from './restaurant.service';

@ApiTags('Restaurant')
@Controller('restaurant')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @ApiOperation({ summary: '음식점 데이터 받기' })
  @Get('/:restaurantId')
  async getRestaurantDetails(@Param('restaurantId') restaurantId: string) {
    const restaurantDetails = await this.restaurantService.getRestaurant(
      restaurantId,
    );

    return restaurantDetails;
  }

  @ApiOperation({ summary: '음식점 데이터 저장하기' })
  @Post('/createRestaurant')
  async CreateRestaurant(@Body() data: CreateRestaurantDto) {
    return this.restaurantService.createRestaurant(
      data.name,
      data.category_name,
      data.category_group_name,
      data.phone_number,
      data.img_url,
      data.kakao_place_id,
      data.latitude,
      data.longitude,
      data.number_address,
      data.road_address,
    );
  }
}
