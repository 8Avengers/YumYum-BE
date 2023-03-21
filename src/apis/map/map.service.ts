import { Restaurant } from './../restaurant/entities/restaurant.entity';
import { Follow } from 'src/apis/user/entities/follow.entity';
import { Post } from 'src/apis/post/entities/post.entity';
import { Repository } from 'typeorm/repository/Repository';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class MapService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
    @InjectRepository(Follow) private followRepository: Repository<Follow>,
    @InjectRepository(Restaurant)
    private restaurantRepository: Repository<Restaurant>,
  ) {}

  async getFollowerPosting(userId: number) {
    let followerPostingResult = [];
    const followerList = await this.followRepository.find({
      relations: ['following'],
      where: { follower: { id: userId } },
      select: { following: { id: true } },
    });
    console.log('followerList : ', followerList);
    for (let following of followerList) {
      const followerPost = await this.postRepository.find({
        relations: ['restaurant', 'user'],
        where: { user: { id: following.following.id } },
        select: {
          id: true,
          rating: true,
          content: true,
          updated_at: true,
          restaurant: {
            place_name: true,
            kakao_place_id: true,
            category_name: true,
            x: true,
            y: true,
          },
          user: { id: true, nickname: true, profile_image: true },
        },
        order: {
          updated_at: 'DESC',
        },
      });
      followerPostingResult.push(...followerPost);
    }
    return followerPostingResult;

    // 팔로워 마다 리스트가 묶여있어서 데이터 뽑기가 힘들다.
    // return await Promise.all(
    //   followerList.map(async (follower) => {
    //     let followerPost = await this.postRepository.find({
    //       relations: ['restaurant'],
    //       where: { user: { id: follower.id } },
    //       select: {
    //         rating: true,
    //         restaurant: { x: true, y: true, place_name: true },
    //         user: { profile_image: true },
    //       },
    //     });
    //     return followerPost;
    //   }),
    // );
  }

  async getMyPosting(userId: number, collectionId: number) {
    return await this.postRepository.find({
      relations: ['user', 'collectionItems', 'restaurant'],
      where: {
        user: { id: userId },
        collectionItems: { collection: { id: collectionId } },
      },
      select: {
        id: true,
        rating: true,
        collectionItems: {},
        user: { profile_image: true },
        restaurant: { place_name: true, category_name: true, x: true, y: true },
      },
      order: {
        updated_at: 'DESC',
      },
    });
  }

  async getLocationRestaurant(x: string, y: string) {
    const locationRestaurant = await this.restaurantRepository
      .createQueryBuilder('restaurant')
      .leftJoin('restaurant.posts', 'post')
      .leftJoin('post.images', 'image')
      .select([
        'restaurant.id',
        'restaurant.place_name',
        'restaurant.x',
        'restaurant.y',
        'post.rating',
        'image.file_url',
      ])
      .addSelect(
        `6371 * acos(cos(radians(${y})) * cos(radians(y)) * cos(radians(x) - radians(${x})) + sin(radians(${y})) * sin(radians(y)))`,
        'distance',
      )
      .having(`distance <= 2`)
      .orderBy('rand()')
      .limit(3)
      .getRawMany();
    return locationRestaurant;
  }
}
