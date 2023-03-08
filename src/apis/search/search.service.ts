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

  async getUserSearch(keyword: String) {
    const userSearchResult = await this.userRepository.findBy({
      nickname: Like(`${keyword}%`),
    });
    return userSearchResult;
  }

  async getRestaurantSearch(keyword: String) {
    const restaurantSearchResult = await this.restaurantRepository.findBy({
      name: Like(`${keyword}%`),
    });
    return restaurantSearchResult;
  }

  async getHashtagSearch(keyword: String) {
    const hashtagSearchResult = await this.hashtagRepository.findBy({
      name: Like(`${keyword}%`),
    });
    return hashtagSearchResult;
  }

  async getPostSearchByHashtag(hashtag: String) {
    const postSearchByHashtagResult = await this.hashtagRepository
      .createQueryBuilder('hashtag')
      .innerJoinAndSelect('hashtag', 'post')
      .where('post.deleted_at IS NULL')
      .andWhere(`INCLUDE ${hashtag} IN hashtag`)
      .select([
        'post.content',
        'post.rating',
        'post.img_url',
        'post.updated_at',
        'user.nickname',
        'restaurant.name',
      ])
      .getMany();

    console.log(postSearchByHashtagResult);
  }
}
