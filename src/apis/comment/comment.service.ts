import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import _ from 'lodash';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment) private commentRepository: Repository<Comment>,
  ) {}

  /*
            ### 23.03.07
            ### 이드보라
            ### 특정 포스팅에 해당하는 모든 댓글 불러오기
           */
  async getAllComments(postId: number) {
    try {
      const comments = await this.commentRepository
        .createQueryBuilder('comment')
        .leftJoinAndSelect('comment.user', 'user')
        .leftJoinAndSelect('comment.id', 'post')
        .where('comment.deletedAt IS NULL')
        .andWhere('post.id = :postId', { postId })
        .select(['post.content', 'user.nickname'])
        .getMany();
      if (!comments || comments.length === 0) {
        throw new NotFoundException('No comments found.');
      }
      return comments;
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

  // /*
  //               ### 23.03.07
  //               ### 이드보라
  //               ### 댓글 하나 불러오기(서비스에서만 사용)
  //               */
  // async getCommentById(id: number) {
  //   try {
  //     const comment = await this.commentRepository
  //       .createQueryBuilder('comment')
  //       .leftJoinAndSelect('post.user', 'user')
  //       .leftJoinAndSelect('comment.id', 'post')
  //       .where('post.id = :id', { id })
  //       .andWhere('comment.deletedAt IS NULL')
  //       .select(['post.content', 'user.nickname'])
  //       .getOne();
  //     if (!comment) {
  //       throw new NotFoundException(`Comment with id ${id} not found.`);
  //     }
  //     return comment;
  //   } catch (err) {
  //     if (err instanceof NotFoundException) {
  //       throw err;
  //     } else {
  //       throw new InternalServerErrorException(
  //         'Something went wrong while processing your request. Please try again later.',
  //       );
  //     }
  //   }
  // }

  /*
                ### 23.03.07
                ### 이드보라
                ### 댓글 작성
                */
  createComment(postId: number, content: string) {
    try {
      return this.commentRepository.insert({
        // user: { id: userId },
        post: { id: postId },
        content,
      });
    } catch (err) {
      throw new InternalServerErrorException(
        'Something went wrong while processing your request. Please try again later.',
      );
    }
  }

  /*
                ### 23.03.07
                ### 이드보라
                ### 댓글 수정
                */
  async updateComment(commentId: number, content: string) {
    try {
      const result = await this.commentRepository.update(commentId, {
        content,
      });
      if (result.affected === 0) {
        throw new NotFoundException(`Comment with id ${commentId} not found.`);
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

  /*
                ### 23.03.07
                ### 이드보라
                ### 댓글 삭제
                */
  async deleteComment(commentId: number) {
    try {
      const result = await this.commentRepository.softDelete(commentId);
      if (result.affected === 0) {
        throw new NotFoundException(`Comment with id ${commentId} not found.`);
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
