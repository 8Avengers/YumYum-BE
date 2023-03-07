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
import { Post } from './entities/post.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
  ) {}

  /*
          ### 23.03.06
          ### 이드보라
          ### 조건 없이 모든 포스팅 불러오기(뉴스피드 페이지)
          */
  async getPosts() {
    try {
      const posts = await this.postRepository
        .createQueryBuilder('post')
        .leftJoinAndSelect('post.restaurant', 'restaurant')
        .leftJoinAndSelect('post.user', 'user')
        .where('post.deleted_at IS NULL')
        .andWhere('post.visibility = "public"')
        .select([
          'post.content',
          'post.rating',
          'post.img_url',
          'post.updated_at',
          'user.nickname',
          'restaurant.name',
        ])
        .getMany();
      if (!posts || posts.length === 0) {
        throw new NotFoundException('No posts found.');
      }
      return posts;
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw new HttpException(err.message, HttpStatus.NOT_FOUND);
      } else {
        throw new InternalServerErrorException(
          'Something went wrong while processing your request. Please try again later.',
        );
      }
    }
  }

  /*
            ### 23.03.06
            ### 이드보라
            ### 포스팅 상세보기
            */
  async getPostById(id: number) {
    try {
      const post = await this.postRepository
        .createQueryBuilder('post')
        .leftJoinAndSelect('post.restaurant', 'restaurant')
        .leftJoinAndSelect('post.user', 'user')
        .where('post.id = :id', { id })
        .andWhere('post.deleted_at IS NULL')
        .andWhere('post.visibility = "public"')
        .select([
          'post.content',
          'post.rating',
          'post.img_url',
          'post.updated_at',
          'user.nickname',
          'restaurant.name',
        ])
        .getOne();

      if (!post) {
        throw new NotFoundException(`Post with id ${id} not found.`);
      }

      return post;
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
            ### 23.03.06
            ### 이드보라
            ### 포스팅 작성
            */
  createPost(content: string, rating: number, img: string, visibility) {
    try {
      return this.postRepository.insert({
        content,
        rating,
        img_url: img,
        visibility,
      });
    } catch (err) {
      throw new InternalServerErrorException(
        'Something went wrong while processing your request. Please try again later.',
      );
    }
  }

  /*
            ### 23.03.06
            ### 이드보라
            ### 포스팅 수정
            */
  async updatePost(
    id: number,
    content: string,
    rating: number,
    img: string,
    visibility,
  ) {
    try {
      const result = await this.postRepository.update(id, {
        content,
        rating,
        img_url: img,
        visibility,
      });
      if (result.affected === 0) {
        throw new NotFoundException(`Post with id ${id} not found.`);
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
            ### 23.03.06
            ### 이드보라
            ### 포스팅 삭제
            */
  async deletePost(id: number) {
    try {
      const result = await this.postRepository.softDelete(id); // soft delete를 시켜주는 것이 핵심입니다!
      if (result.affected === 0) {
        throw new NotFoundException(`Post with id ${id} not found.`);
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
