import { Repository } from 'typeorm/repository/Repository';
import { Restaurant } from './entities/restaurant.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(Restaurant)
    private restaurantRepository: Repository<Restaurant>,
  ) {}

  /*
        ### 23.03.11
        ### 최호인  
        ### 음식점 상세정보 가져오기 작성
        */
  async getRestaurant(id: string) {
    return await this.restaurantRepository.findBy({
      kakao_place_id: id,
    });
  }

  createRestaurant(
    name: string,
    category_name: string,
    category_group_name: string,
    phone_number: string,
    img_url: string,
    kakao_place_id: string,
    latitude: number,
    longitude: number,
    number_address: string,
    road_address: string,
  ) {
    try {
      return this.restaurantRepository.insert({
        name,
        category_name,
        category_group_name,
        phone_number,
        img_url,
        kakao_place_id,
        latitude,
        longitude,
        number_address,
        road_address,
      });
    } catch (err) {
      throw new InternalServerErrorException(
        'Something went wrong while processing your request. Please try again later.',
      );
    }
  }
}
