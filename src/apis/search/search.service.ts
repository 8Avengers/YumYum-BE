import { Hashtag } from './../post/entities/hashtag.entity';
import { Restaurant } from './../restaurant/entities/restaurant.entity';
import { User } from './../user/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm/repository/Repository';
import { IsNull, ILike } from 'typeorm';

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
  async getUserSearch(keyword: string, page: string) {
    const pageNum = Number(page) - 1;
    const userInOnePage = 15;
    const userSearchResult = await this.userRepository.find({
      where: { nickname: ILike(`${keyword}%`), deleted_at: null },
      select: { id: true, nickname: true, profile_image: true },
      skip: pageNum * userInOnePage,
      take: userInOnePage,
    });
    return userSearchResult;
  }

  /*
      ### 23.03.06
      ### 최호인
      ### 음식점 정보 검색
    */
  async getRestaurantSearch(keyword: string, page: string) {
    const pageNum = Number(page) - 1;
    const restaurantInOnePage = 15;
    const restaurantSearchResult = await this.restaurantRepository.find({
      where: { place_name: ILike(`${keyword}%`), deleted_at: null },
      select: { id: true, place_name: true },
      skip: pageNum * restaurantInOnePage,
      take: restaurantInOnePage,
    });
    return restaurantSearchResult;
  }

  /*
      ### 23.03.06
      ### 최호인
      ### 해시태그 검색
    */
  async getHashtagSearch(keyword: string, page: string) {
    const pageNum = Number(page) - 1;
    const hashtagInOnePage = 15;
    const hashtagSearchResult = await this.hashtagRepository.find({
      where: { name: ILike(`%${keyword}%`), deleted_at: null },
      select: { id: true, name: true },
      skip: pageNum * hashtagInOnePage,
      take: hashtagInOnePage,
    });
    return hashtagSearchResult;
  }

  /*
      ### 23.03.08
      ### 최호인
      ### 해시태그를 기반으로 포스팅 불러오기
    */
  async getPostSearchByHashtag(hashtag: string, page: string) {
    const pageNum = Number(page) - 1;
    const postInOnePageWithSearchHashtag = 15;
    const postSearchByHashtagResult = await this.hashtagRepository.find({
      relations: ['posts'],
      where: {
        name: hashtag,
        posts: { visibility: 'public' },
      },
      skip: pageNum * postInOnePageWithSearchHashtag,
      take: postInOnePageWithSearchHashtag,
    });
    return postSearchByHashtagResult;
  }
}
