import { CollectionItem } from './../collection/entities/collection-item.entity';
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
  ) {}

  async getFollowerPosting(userId: number) {
    let followerPostingResult = [];
    const followerList = await this.followRepository.find({
      relations: ['follower'],
      where: { follower: { id: userId } },
      select: { follower: { id: true } },
    });

    console.log('followerList : ', followerList);
    for (let follower of followerList) {
      const followerPost = await this.postRepository.find({
        relations: ['restaurant', 'user'],
        where: { user: { id: follower.follower.id } },
        select: {
          id: true,
          rating: true,
          restaurant: {
            place_name: true,
            category_name: true,
            x: true,
            y: true,
          },
          user: { profile_image: true },
        },
        order: {
          updated_at: 'DESC',
        },
      });
      followerPostingResult.push(followerPost);
    }
    return followerPostingResult;

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
}
