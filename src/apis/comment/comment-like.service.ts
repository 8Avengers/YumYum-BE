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
import { Repository, In } from 'typeorm';
import { CommentLike } from './entities/comment-like.entity';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentLikeService {
  constructor(
    @InjectRepository(CommentLike)
    private readonly commentLikeRepository: Repository<CommentLike>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  /*
                                                  ### 23.03.09
                                                  ### 이드보라
                                                  ### 한개의 댓글의 총 좋아요 수 불러오기(사용하지 않음)
                                                  */

  async getLikesForComment(commentId: number): Promise<number> {
    try {
      const likes = await this.commentLikeRepository.findAndCount({
        where: { comment: { id: commentId } },
      });

      const count = likes[1];

      return count;
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

  /*
                                                ### 23.03.09
                                                ### 이드보라
                                                ### 모든 댓글의 각 좋아요 수 불러오기
                                                */

  async getLikesForAllComments(
    commentIds: number[],
  ): Promise<{ commentId: number; totalLikes: number }[]> {
    try {
      const commentLikes = await this.commentLikeRepository.find({
        where: { comment: { id: In(commentIds) } },
        select: ['id', 'comment'],
        relations: ['comment'],
      });

      const likes = commentLikes.map(({ comment }) => ({
        commentId: comment.id,
        totalLikes: commentLikes.filter((cl) => cl.comment.id === comment.id)
          .length,
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
                                                ### 23.03.09
                                                ### 이드보라
                                                ### 댓글 하나 좋아요 하기
                                                */

  async likeComment(commentId, userId) {
    try {
      const existComment = await this.commentRepository.findOne({
        where: {
          id: commentId,
        },
      });

      if (!existComment) {
        throw new NotFoundException('존재하지 않는 댓글입니다.');
      }

      const existLike = await this.commentLikeRepository.findOne({
        where: {
          comment: { id: commentId },
          user: { id: userId },
        },
        withDeleted: true,
      });

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

  async unlikeComment(commentId, userId) {
    try {
      const existComment = await this.commentRepository.findOne({
        where: {
          id: commentId,
        },
      });

      if (!existComment) {
        throw new NotFoundException('존재하지 않는 댓글입니다.');
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
