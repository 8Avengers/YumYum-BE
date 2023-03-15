import { Follow } from 'src/apis/user/entities/follow.entity';
import { Post } from 'src/apis/post/entities/post.entity';
import { Repository } from 'typeorm/repository/Repository';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class MapService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
    @InjectRepository(Follow) private followRepository: Repository<Follow>,
  ) {}

  async getFollowerPosting(userId: number) {
    const followerList = await this.followRepository.findBy({
      follower: { id: userId },
    });
    // for (let follower of followerList) {
    //   const followerPost = await this.postRepository.find({
    //     relations: ['restaurant'],
    //     where: { user: { id: follower.id } },
    //   });
    //   followerPostingResult.push(...followerPost);
    // }

    // map 메소드는 await이 작동을 안해서 Promise를 리턴을 하기 때문에 비동기로 작동하지 않는다.
    return await Promise.all(
      followerList.map(async (follower) => {
        let followerPost = await this.postRepository.find({
          relations: ['restaurant'],
          where: { user: { id: follower.id } },
        });
        return followerPost;
      }),
    );
  }

  async getMyPosting(userId: number) {
    return await this.postRepository.find({
      relations: ['restaurant'],
      where: { user: { id: userId } },
    });
  }
}
