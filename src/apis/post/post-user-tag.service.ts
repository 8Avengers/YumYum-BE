import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
  ) {}

  async tagUsersInPost(postId: number, usernames: string[]): Promise<Post> {
    const post = await this.postRepository.findOne({ where: { id: postId } });

    const users = await this.userRepository.find({
      where: { nickname: In(usernames) },
    });

    const userTags = [];

    for (const username of usernames) {
      const user = users.find((u) => u.nickname === username);

      const postUserTag = new PostUserTag();
      postUserTag.post = post;
      postUserTag.user = user;

      userTags.push(postUserTag);
    }

    post.postUserTags = userTags;

    return this.postRepository.save(post);
  }
}
