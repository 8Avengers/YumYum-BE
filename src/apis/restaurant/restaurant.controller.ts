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
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RestaurantService } from './restaurant.service';

@ApiTags('Restaurant')
@Controller('restaurant')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @ApiOperation({ summary: '가게 데이터 받기' })
  @Get('/:kakao_place_id')
  async getRestaurantDetails(@Param('kakao_place_id') kakao_place_id: string) {
    const restaurantDetails = await this.restaurantService.getRestaurant(
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
}
