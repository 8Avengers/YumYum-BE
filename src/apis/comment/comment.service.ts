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
import { PostService } from '../post/post.service';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment) private commentRepository: Repository<Comment>,
    @Inject(PostService) private postService: PostService,
  ) {}

  /*
                    ### 23.03.07
                    ### 이드보라
                    ### 특정 포스팅에 해당하는 모든 댓글 불러오기
                   */
  async getAllComments(postId: number) {
    try {
      await this.postService.getPostById(postId);

      console.log('11111');

      const comments = await this.commentRepository
        .createQueryBuilder('comment')
        .leftJoinAndSelect('comment.user', 'user')
        .leftJoinAndSelect('comment.post', 'post')
        .where('comment.deleted_at IS NULL')
        .andWhere('post.id = :postId', { postId })
        .select(['comment.content', 'user.nickname'])
        .getMany();
      console.log('222222');

      if (!comments || comments.length === 0) {
        throw new NotFoundException('No comments found.');
      }

      console.log('333333');
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
  async createComment(postId: number, content: string) {
    try {
      await this.postService.getPostById(postId);

      return await this.commentRepository.insert({
        // user: { id: userId },
        post: { id: postId },
        content,
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

  /*
                        ### 23.03.07
                        ### 이드보라
                        ### 댓글 수정
                        */
  async updateComment(postId: number, commentId: number, content: string) {
    try {
      await this.postService.getPostById(postId);

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
  async deleteComment(postId: number, commentId: number) {
    try {
      await this.postService.getPostById(postId);

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
