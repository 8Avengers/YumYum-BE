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
import { CommentLike } from './entities/comment-like.entity';

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(PostLike)
    private readonly postLikeRepository: Repository<PostLike>,
    @InjectRepository(CommentLike)
    private readonly commentLikeRepository: Repository<CommentLike>,
  ) {}

  /*
                            ### 23.03.08
                            ### 이드보라
                            ### 한개의 포스팅의 총 좋아요 수 불러오기
                            */

  async getLikesForPost(postId: number): Promise<number> {
    const likes = await this.postLikeRepository
      .createQueryBuilder('post_like')
      .select('COUNT(post_like.id)', 'likes')
      .where('post_like.post_id = :id', { postId })
      .getRawOne();

    return likes.length;
  }

  /*
                          ### 23.03.08
                          ### 이드보라
                          ### 모든 포스팅의 각 좋아요 수 불러오기
                          */

  async getLikesForAllPosts(
    postIds: number[],
  ): Promise<{ post_id: number; totalLikes: number }[]> {
    const postLikes = await this.postLikeRepository
      .createQueryBuilder('post_like')
      .select('post_like.post_id', 'post_id')
      .addSelect('COUNT(*)', 'totalLikes')
      .where('post_like.post_id IN (:...postIds)', { postIds })
      .groupBy('post_like.post_id')
      .getRawMany();

    return postLikes.map((postLike) => ({
      post_id: postLike.post_id,
      totalLikes: postLike.totalLikes,
    }));
  }

  /*
                          ### 23.03.09
                          ### 이드보라
                          ### 포스트 하나 좋아요 하기
                          */

  async createPostLike(postId, userId) {
    try {
      return this.postLikeRepository.insert({
        post: { id: postId },
        user: { id: userId },
      });
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
