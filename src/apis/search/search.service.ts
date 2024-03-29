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
      // select: { id: true, place_name: true },
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
    const postInOnePageWithSearchHashtag = 8;
    const postSearchByHashtagResult = await this.hashtagRepository.find({
      relations: [
        'posts',
        'posts.user',
        'posts.restaurant',
        'posts.images',
        // 'posts.collectionItem',
        // 'posts.collectionItem.collection',
      ],
      where: {
        name: hashtag,
        posts: { visibility: 'public' },
      },
      select: {
        posts: {
          id: true,
          content: true,
          rating: true,
          updated_at: true,
          created_at: true,
          visibility: true,
          user: {
            id: true,
            nickname: true,
            profile_image: true,
          },
          restaurant: {
            kakao_place_id: true,
            address_name: true,
            category_name: true,
            place_name: true,
            road_address_name: true,
          },
          images: {
            id: true,
            file_url: true,
            created_at: true,
          },
          collectionItems: { id: true, collection: { id: true, type: true } },
        },
      },
      skip: pageNum * postInOnePageWithSearchHashtag,
      take: postInOnePageWithSearchHashtag,
    });
    return postSearchByHashtagResult[0].posts;
  }
}
