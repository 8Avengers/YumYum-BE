import { Repository } from 'typeorm/repository/Repository';
import { Restaurant } from './entities/restaurant.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
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
  async getRestaurant(kakao_place_id: string) {
    return await this.restaurantRepository.findBy({
      kakao_place_id: kakao_place_id,
    });
  }

  async createRestaurant(
    address_name: string,
    category_group_code: string,
    category_group_name: string,
    category_name: string,
    kakao_place_id: string,
    phone: string,
    place_name: string,
    road_address_name: string,
    x: string,
    y: string,
  ) {
    try {
      const restaurant = await this.getRestaurant(kakao_place_id);
      if (restaurant.length > 0) {
        return restaurant[0].id;
      }
      const { identifiers } = await this.restaurantRepository.insert({
        address_name,
        category_group_code,
        category_group_name,
        category_name,
        kakao_place_id,
        phone,
        place_name,
        road_address_name,
        x,
        y,
      });

      return identifiers[0].id;
    } catch (err) {
      throw new InternalServerErrorException(
        'Something went wrong while processing your request. Please try again later.',
      );
    }
  }

  async updateRestaurant(
    address_name: string,
    category_group_code: string,
    category_group_name: string,
    category_name: string,
    kakao_place_id: string,
    phone: string,
    place_name: string,
    road_address_name: string,
    x: string,
    y: string,
  ) {
    const restaurant = await this.getRestaurant(kakao_place_id);
    if (restaurant.length < 1) {
      throw new NotFoundException('없는 가게 정보 입니다.');
    }
    return this.restaurantRepository.update(
      { kakao_place_id: kakao_place_id },
      {
        address_name,
        category_group_code,
        category_group_name,
        category_name,
        kakao_place_id,
        phone,
        place_name,
        road_address_name,
        x,
        y,
      },
    );
  }
  catch(err) {
    if (err instanceof NotFoundException) {
      throw err;
    } else {
      throw new InternalServerErrorException(
        'Something went wrong while processing your request. Please try again later.',
      );
    }
  }

  async deleteRestaurant(kakao_place_id) {
    try {
      const result = await this.restaurantRepository.softDelete({
        kakao_place_id: kakao_place_id,
      }); // soft delete를 시켜주는 것이 핵심입니다!
      if (result.affected === 0) {
        throw new NotFoundException(
          `Restaurant with kakao_place_id : ${kakao_place_id} not found.`,
        );
      }
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw err;
      } else {
        throw new InternalServerErrorException(
          'Something went wrong while processing your request. Please try again later.',
        );
      }
    }
  }
}
