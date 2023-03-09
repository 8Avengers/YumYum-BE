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
import { CommentLike } from './entities/comment-like.entity';

@Injectable()
export class CommentLikeService {
  constructor(
    @InjectRepository(CommentLike)
    private readonly commentLikeRepository: Repository<CommentLike>,
  ) {}

  /*
                                  ### 23.03.09
                                  ### 이드보라
                                  ### 한개의 댓글의 총 좋아요 수 불러오기
                                  */

  async getLikesForComment(commentId: number): Promise<number> {
    const likes = await this.commentLikeRepository
      .createQueryBuilder('comment_like')
      .select('COUNT(comment_like.id)', 'likes')
      .where('comment_like.comment_id = :id', { commentId })
      .getRawOne();

    return likes.length;
  }

  /*
                                ### 23.03.09
                                ### 이드보라
                                ### 모든 댓글의 각 좋아요 수 불러오기
                                */

  async getLikesForAllComments(
    commentIds: number[],
  ): Promise<{ commentId: number; totalLikes: number }[]> {
    console.log('commentIds', commentIds);

    const commentLikes = await this.commentLikeRepository
      .createQueryBuilder('comment_like')
      .select('comment_like.comment_id', 'comment_id')
      .addSelect('COUNT(*)', 'totalLikes')
      .where('comment_like.comment_id IN (:...commentIds)', { commentIds })
      .groupBy('comment_like.comment_id')
      .getRawMany();

    return commentLikes.map((commentLike) => ({
      commentId: commentLike.comment_id,
      totalLikes: commentLike.totalLikes,
    }));
  }

  /*
                                ### 23.03.09
                                ### 이드보라
                                ### 댓글 하나 좋아요 하기
                                */

  async likeComment(commentId, userId) {
    try {
      if (!commentId) {
        throw new NotFoundException(`Post with id ${commentId} not found.`);
      }

      const existLike = await this.commentLikeRepository.findOne({
        where: {
          comment: { id: commentId },
          user: { id: userId },
        },
        withDeleted: true,
      });

      if (existLike && existLike.deleted_at === null) {
        await this.commentLikeRepository.softDelete({
          comment: { id: commentId },
          user: { id: userId },
        });
      } else {
        if (existLike && existLike.deleted_at !== null) {
          await this.commentLikeRepository.restore({
            comment: { id: commentId },
            user: { id: userId },
          });
        } else {
          await this.commentLikeRepository.insert({
            comment: { id: commentId },
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
