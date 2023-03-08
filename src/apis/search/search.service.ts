import { Hashtag } from './../post/entities/hashtag.entity';
import { Restaurant } from './../restaurant/entities/restaurant.entity';
import { User } from './../user/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm/repository/Repository';
import { Like } from 'typeorm/find-options/operator/Like';

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Restaurant)
    private restaurantRepository: Repository<Restaurant>,
    @InjectRepository(Hashtag) private hashtagRepository: Repository<Hashtag>,
  ) {}
  /*
      ### 23.03.06
      ### 최호인
      ### 사용자 정보 검색
    */
  async getUserSearch(keyword: string) {
    const userSearchResult = await this.userRepository.findBy({
      nickname: Like(`${keyword}%`),
    });
    return userSearchResult;
  }
  /*
      ### 23.03.06
      ### 최호인
      ### 음식점 정보 검색
    */
  async getRestaurantSearch(keyword: string) {
    const restaurantSearchResult = await this.restaurantRepository.findBy({
      name: Like(`${keyword}%`),
    });
    return restaurantSearchResult;
  }
  /*
      ### 23.03.06
      ### 최호인
      ### 해시태그 검색
    */
  async getHashtagSearch(keyword: string) {
    const hashtagSearchResult = await this.hashtagRepository.findBy({
      name: Like(`${keyword}%`),
    });
    return hashtagSearchResult;
  }

  /*
      ### 23.03.08
      ### 최호인
      ### 해시태그를 기반으로 포스팅 불러오기
    */

  async getPostSearchByHashtag(hashtag: string) {
    const postSearchByHashtagResult = await this.hashtagRepository.find({
      relations: ['posts'],
      where: [{ deleted_at: null }, { name: hashtag }],
    });

    console.log(postSearchByHashtagResult);
    return postSearchByHashtagResult;
  }
}
