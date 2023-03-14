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
    let followerPostingResult = [];
    let followerList = await this.followRepository.findBy({
      follower: { id: userId },
    });

    for (let follower of followerList) {
      const followerPost = await this.postRepository.find({
        relations: ['restaurant'],
        where: { user: { id: follower.id } },
      });
      console.log(follower.id, '여기 시작1', followerPost, '여기 끝');
      if (followerPost.length < 1) {
        continue;
      }

      followerPostingResult.push(...followerPost);
    }
    // followerPostingResult = followerList.map(function (follower) {
    //   this.postRepository.findBy({
    //     userId: follower.id,
    //   });
    // });
    return followerPostingResult;
  }
}
