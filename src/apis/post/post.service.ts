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
import { PostLikeService } from './post-like.service';
import { PostWithLikesDto } from './dto/post-with-likes.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
    private readonly likeService: PostLikeService,
  ) {}

  /*
                            ### 23.03.08
                            ### 이드보라
                            ### 조건 없이 모든 포스팅 불러오기(뉴스피드 페이지).좋아요 기능 추가
                            */
  async getPosts(): Promise<PostWithLikesDto[]> {
    try {
      const posts = await this.postRepository
        .createQueryBuilder('post')
        .leftJoinAndSelect('post.restaurant', 'restaurant')
        .leftJoinAndSelect('post.user', 'user')
        .where('post.deleted_at IS NULL')
        .andWhere('post.visibility = "public"')
        .select([
          'post.id',
          'post.content',
          'post.rating',
          'post.img_url',
          'post.updated_at',
          'user.nickname',
          'restaurant.name',
        ])
        .getMany();
      if (!posts || posts.length === 0) {
        throw new NotFoundException('포스트가 없습니다.');
      }
      const postIds = posts.map((post) => post.id);

      const postLikes = await this.likeService.getLikesForAllPosts(postIds);

      const postListWithLikes = posts.map((post) => {
        const likes =
          postLikes.find((like) => like.postId === post.id)?.totalLikes || 0;
        return { ...post, totalLikes: likes };
      });

      return postListWithLikes;
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
                              ### 23.03.08
                              ### 이드보라
                              ### 포스팅 상세보기.좋아요 기능 추가
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
        throw new NotFoundException(`존재하지 않는 포스트입니다.`);
      }

      const totalLikes = await this.likeService.getLikesForPost(id);

      return { ...post, totalLikes: totalLikes };
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
        throw new NotFoundException('존재하지 않는 포스트입니다.');
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
