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

  async getFollowerPosting(userId: number, type: string) {
    if (type == 'FOLLOWING') {
      let followerPostingResult = [];
      const followerList = await this.followRepository.find({
        relations: ['following'],
        where: { follower: { id: userId } },
        select: { following: { id: true } },
      });
      for (let following of followerList) {
        const followerPost = await this.postRepository.find({
          relations: ['restaurant', 'user'],
          where: { visibility: 'public', user: { id: following.following.id } },
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
    } else {
      return await this.postRepository.find({
        relations: ['restaurant', 'user'],
        where: { visibility: 'public' },
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
    }

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

  async getFollowerPostingList(userId: number) {
    let followerPostingResult = [];
    const followerList = await this.followRepository.find({
      relations: ['following'],
      where: { follower: { id: userId } },
      select: { following: { id: true } },
    });
    for (let following of followerList) {
      const followerPost = await this.postRepository.find({
        relations: ['restaurant', 'user', 'images'],
        where: { visibility: 'public', user: { id: following.following.id } },
        select: {
          id: true,
          rating: true,
          content: true,
          images: {
            file_url: true,
          },
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
  }

  async getMyCollectionPosting(userId: number, collectionId: number) {
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

  async getUserPosting(userId: number) {
    return await this.postRepository.find({
      relations: ['restaurant'],
      where: {
        visibility: 'public',
        user: { id: userId },
      },
      select: {
        id: true,
        rating: true,
        user: {
          id: true,
          profile_image: true,
        },
        restaurant: {
          id: true,
          place_name: true,
          category_name: true,
          x: true,
          y: true,
        },
      },
    });
  }
}
