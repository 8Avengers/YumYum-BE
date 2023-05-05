import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DataSource, In, Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { PostLike } from './entities/post-like.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PostLikeRepository extends Repository<PostLike> {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Post) private PostRepository: Repository<Post>,
  ) {
    super(PostLike, dataSource.createEntityManager());
  }

  async getLikesforPost(postId: number): Promise<[PostLike[], number]> {
    try {
      return await this.findAndCount({
        where: { post: { id: postId } },
      });
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException(
        'Something went wrong while processing your request. Please try again later.',
      );
    }
  }

  async getLikesForAllPosts(postIds: number[]): Promise<PostLike[]> {
    try {
      return await this.find({
        select: ['id', 'post'],
        where: { post: { id: In(postIds) } },
        relations: ['post'],
      });
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException(
        'Something went wrong while processing your request. Please try again later.',
      );
    }
  }

  async getLikedStatusForOnePost(
    postId: number,
    userId: number,
  ): Promise<PostLike> {
    try {
      return await this.findOne({
        where: { post: { id: postId }, user: { id: userId } },
        withDeleted: true,
      });
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException(
        'Something went wrong while processing your request. Please try again later.',
      );
    }
  }

  async getLikedStatusForAllPosts(
    postIds: number[],
    userId: number,
  ): Promise<PostLike[]> {
    try {
      return await this.find({
        where: {
          post: { id: In(postIds) },
          user: { id: userId },
        },
        relations: ['post'],
      });
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException(
        'Something went wrong while processing your request. Please try again later.',
      );
    }
  }

  async restoreLike(postId: number, userId: number): Promise<void> {
    try {
      await this.restore({
        post: { id: postId },
        user: { id: userId },
      });
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException(
        'Something went wrong while processing your request. Please try again later.',
      );
    }
  }

  async likePost(postId: number, userId: number): Promise<void> {
    try {
      await this.insert({
        post: { id: postId },
        user: { id: userId },
      });
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException(
        'Something went wrong while processing your request. Please try again later.',
      );
    }
  }

  async unlikePost(postId: number, userId: number): Promise<void> {
    try {
      await this.softDelete({
        post: { id: postId },
        user: { id: userId },
      });
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException(
        'Something went wrong while processing your request. Please try again later.',
      );
    }
  }
}
