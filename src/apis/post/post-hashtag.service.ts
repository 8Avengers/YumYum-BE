import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { Hashtag } from './entities/hashtag.entity';

@Injectable()
export class PostHashtagService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(Hashtag)
    private readonly hashtagRepository: Repository<Hashtag>,
  ) {}

  async createOrUpdateHashtags(hashtagNames: string[]): Promise<Hashtag[]> {
    try {
      return Promise.all(
        hashtagNames.map(async (name) => {
          let hashtag = await this.hashtagRepository.findOne({
            where: { name },
          });
          if (!hashtag) {
            hashtag = new Hashtag();
            hashtag.name = name;
            await this.hashtagRepository.save(hashtag);
          }
          return hashtag;
        }),
      );
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException(
        'Something went wrong while processing your request. Please try again later.',
      );
    }
  }
}
