import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { Post } from './entities/post.entity';
import { PostUserTag } from './entities/post-usertag.entity';
import { In } from 'typeorm';

@Injectable()
export class PostUserTagService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(PostUserTag)
    private readonly postUserTagRepository: Repository<PostUserTag>,
  ) {}

  async tagUsersInPost(postId: number, usernames: string[]): Promise<Post> {
    try {
      const post = await this.postRepository.findOne({
        where: { id: postId },
      });

      const users = await this.userRepository.find({
        where: { nickname: In(usernames) },
      });

      for (const username of usernames) {
        const user = users.find((u) => u.nickname === username);

        await this.postUserTagRepository.save({
          post: { id: postId },
          user: { id: user.id },
        });
      }

      await this.postRepository.save(post);

      return post;
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException(
        'Something went wrong while processing your request. Please try again later.',
      );
    }
  }

  async updateUserTagInPost(postId: number, usernames: string[]) {
    try {
      const post = await this.postRepository.findOne({
        where: { id: postId },
      });

      const users = await this.userRepository.find({
        where: { nickname: In(usernames) },
      });

      for (const username of usernames) {
        const user = users.find((u) => u.nickname === username);

        await this.postUserTagRepository.save({
          post: { id: postId },
          user: { id: user.id },
        });
      }

      await this.postRepository.save(post);

      return post;
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException(
        'Something went wrong while processing your request. Please try again later.',
      );
    }
  }
}
