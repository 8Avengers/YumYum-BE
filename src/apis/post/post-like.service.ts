import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import _ from 'lodash';
import { Repository } from 'typeorm';
import { PostLike } from './entities/post-like.entity';

@Injectable()
export class PostLikeService {
  constructor(
    @InjectRepository(PostLike)
    private readonly postLikeRepository: Repository<PostLike>,
  ) {}

  /*
                                          ### 23.03.08
                                          ### 이드보라
                                          ### 한개의 포스팅의 총 좋아요 수 불러오기
                                          */

  async getLikesForPost(postId: number): Promise<number> {
    const likes = await this.postLikeRepository
      .createQueryBuilder('post_like')
      .select('COUNT(post_like.post_id)', 'likes')
      .where('post_like.post_id = :postId', { postId })
      .getRawOne();

    return likes.likes;
  }

  /*
                                        ### 23.03.08
                                        ### 이드보라
                                        ### 모든 포스팅의 각 좋아요 수 불러오기
                                        */

  async getLikesForAllPosts(
    postIds: number[],
  ): Promise<{ postId: number; totalLikes: number }[]> {
    console.log('postIds', postIds);
    const postLikes = await this.postLikeRepository
      .createQueryBuilder('post_like')
      .select('post_like.post_id', 'post_id')
      .addSelect('COUNT(*)', 'totalLikes')
      .where('post_like.post_id IN (:...postIds)', { postIds })
      .groupBy('post_like.post_id')
      .getRawMany();

    return postLikes.map((postLike) => ({
      postId: postLike.post_id,
      totalLikes: postLike.totalLikes,
    }));
  }

  /*
                                        ### 23.03.09
                                        ### 이드보라
                                        ### 포스트 하나 좋아요 하기
                                        */

  async likePost(postId, userId) {
    try {
      if (!postId) {
        throw new NotFoundException(`Post with id ${postId} not found.`);
      }

      const existLike = await this.postLikeRepository.findOne({
        where: {
          post: { id: postId },
          user: { id: userId },
        },
        withDeleted: true,
      });

      if (existLike && existLike.deleted_at === null) {
        await this.postLikeRepository.softDelete({
          post: { id: postId },
          user: { id: userId },
        });
      } else {
        if (existLike && existLike.deleted_at !== null) {
          await this.postLikeRepository.restore({
            post: { id: postId },
            user: { id: userId },
          });
        } else {
          await this.postLikeRepository.insert({
            post: { id: postId },
            user: { id: userId },
          });
        }
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
