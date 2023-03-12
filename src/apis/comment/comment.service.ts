import {
  Injectable,
  Inject,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import _ from 'lodash';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { CommentLikeService } from './comment-like.service';
import { Post } from '../post/entities/post.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment) private commentRepository: Repository<Comment>,
    @InjectRepository(Post) private postRepository: Repository<Post>,
    private readonly commentLikeService: CommentLikeService,
  ) {}

  /*
                                  ### 23.03.07
                                  ### 이드보라
                                  ### 특정 포스팅에 해당하는 모든 댓글 불러오기
                                 */
  async getAllComments(postId: number, userId: number) {
    try {
      const existPost = await this.postRepository.findOne({
        where: { id: postId },
      });
      if (!existPost) {
        throw new NotFoundException('존재하지 않는 포스트입니다.');
      }

      const comments = await this.commentRepository.find({
        where: { deleted_at: null, post: { id: postId } },
        select: ['id', 'content'],
        relations: ['user'],
      });

      const commentIds = comments.map((comment) => comment.id);
      const commentLikes = await this.commentLikeService.getLikesForAllComments(
        commentIds,
      );

      const likedStatuses =
        await this.commentLikeService.getLikedStatusforAllComments(
          commentIds,
          userId,
        );

      return comments.map((comment) => {
        const likes =
          commentLikes.find((like) => like.commentId === comment.id)
            ?.totalLikes || 0;
        const isLiked =
          likedStatuses.find((status) => status.commentId === comment.id)
            ?.isLiked || 'False';
        return { ...comment, totalLikes: likes, isLiked };
      });
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
  async createComment(postId: number, userId: number, content: string) {
    try {
      const existPost = await this.postRepository.findOne({
        where: { id: postId },
      });
      if (!existPost) {
        throw new NotFoundException('존재하지 않는 포스트입니다.');
      }

      return await this.commentRepository.insert({
        // user: { id: userId },
        post: { id: postId },
        user: { id: userId },
        content,
      });
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
                                      ### 23.03.07
                                      ### 이드보라
                                      ### 댓글 수정
                                      */
  async updateComment(postId: number, commentId: number, content: string) {
    try {
      const existPost = await this.postRepository.findOne({
        where: { id: postId },
      });
      if (!existPost) {
        throw new NotFoundException('존재하지 않는 포스트입니다.');
      }

      const result = await this.commentRepository.update(commentId, {
        content,
      });
      if (result.affected === 0) {
        throw new NotFoundException(`존재하지 않는 댓글입니다.`);
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

  /*
                                      ### 23.03.07
                                      ### 이드보라
                                      ### 댓글 삭제
                                      */
  async deleteComment(postId: number, commentId: number) {
    try {
      const existPost = await this.postRepository.findOne({
        where: { id: postId },
      });
      if (!existPost) {
        throw new NotFoundException('존재하지 않는 포스트입니다.');
      }

      const result = await this.commentRepository.softDelete(commentId);
      if (result.affected === 0) {
        throw new NotFoundException(`존재하지 않는 댓글입니다.`);
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
