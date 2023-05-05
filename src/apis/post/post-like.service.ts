import {
  //HttpException,
  //HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
//import _ from 'lodash';
//import { Repository, In } from 'typeorm';
import { PostLikeRepository } from './post-like.repository';
import { PostRepository } from './post.repository';

@Injectable()
export class PostLikeService {
  constructor(
    private readonly postLikeRepository: PostLikeRepository,
    private readonly postRepository: PostRepository,
  ) {}

  /*
                                                                          ### 23.03.08
                                                                          ### 이드보라
                                                                          ### 한개의 포스팅의 총 좋아요 수 불러오기
                                                                          */

  async getLikesForPost(postId: number): Promise<number> {
    try {
      const postLikes = await this.postLikeRepository.getLikesforPost(postId);

      return postLikes[1];
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException(
        'Something went wrong while processing your request. Please try again later.',
      );
    }
  }

  /*
                                                                        ### 23.03.08
                                                                        ### 이드보라
                                                                        ### 모든 포스팅의 각 좋아요 수 불러오기
                                                                        */

  async getLikesForAllPosts(
    postIds: number[],
  ): Promise<{ postId: number; totalLikes: number }[]> {
    try {
      const postLikes = await this.postLikeRepository.getLikesForAllPosts(
        postIds,
      );

      const likes = postLikes.map(({ post }) => ({
        postId: post.id,
        totalLikes: postLikes.filter((pl) => pl.post.id === post.id).length,
      }));

      return likes;
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException(
        'Something went wrong while processing your request. Please try again later.',
      );
    }
  }

  /*
              ### 23.03.12
                                                                        ### 이드보라
                                                                        ### 사용자가 그 포스트를 좋아요 했는지 알아보기
                                                                        */
  async getLikedStatusForOnePost(postId: number, userId: number) {
    try {
      const postLiked = await this.postLikeRepository.getLikedStatusForOnePost(
        postId,
        userId,
      );

      return {
        isLiked: postLiked ? 'True' : 'False',
      };
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException(
        'Something went wrong while processing your request. Please try again later.',
      );
    }
  }

  /*
              ### 23.03.12
                                                                        ### 이드보라
                                                                        ### 사용자가 그 포스트를 좋아요 했는지 알아보기(모든 포스트에서)
                                                                        */

  async getLikedStatusForAllPosts(postIds, userId) {
    try {
      const postLikes = await this.postLikeRepository.getLikedStatusForAllPosts(
        postIds,
        userId,
      );

      return postIds.map((postId) => {
        const isLiked = postLikes.some((like) => like.post.id === postId);
        return {
          postId,
          isLiked: isLiked ? 'True' : 'False',
        };
      });
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException(
        'Something went wrong while processing your request. Please try again later.',
      );
    }
  }

  /*
                                                                        ### 23.05.04
                                                                        ### 이드보라
                                                                        ### 포스트 하나 좋아요 하기(likes 컬럼 추가)
                                                                        */

  async likePost(postId, userId) {
    try {
      const existingPost = await this.postRepository.getOneSimplePost(postId);

      if (!existingPost) {
        throw new NotFoundException('존재하지 않는 포스트입니다.');
      }

      const existLike = await this.postLikeRepository.getLikedStatusForOnePost(
        postId,
        userId,
      );

      if (existLike && existLike.deleted_at !== null) {
        await this.postLikeRepository.restoreLike(postId, userId);
      } else {
        await this.postLikeRepository.likePost(postId, userId);
      }
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw err;
      } else {
        console.error(err);
        throw new InternalServerErrorException(
          'Something went wrong while processing your request. Please try again later.',
        );
      }
    }
  }

  async unlikePost(postId, userId) {
    try {
      const existingPost = await this.postRepository.getOneSimplePost(postId);

      if (!existingPost) {
        throw new NotFoundException('존재하지 않는 포스트입니다.');
      }

      const existLike = await this.postLikeRepository.getLikedStatusForOnePost(
        postId,
        userId,
      );

      if (existLike && existLike.deleted_at === null) {
        await this.postLikeRepository.unlikePost(postId, userId);
      }
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw err;
      } else {
        console.error(err);
        throw new InternalServerErrorException(
          'Something went wrong while processing your request. Please try again later.',
        );
      }
    }
  }
}
