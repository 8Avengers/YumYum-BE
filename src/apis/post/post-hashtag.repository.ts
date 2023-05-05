import { DataSource, Repository } from 'typeorm';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Hashtag } from './entities/hashtag.entity';

@Injectable()
export class HashtagRepository extends Repository<Hashtag> {
  constructor(private dataSource: DataSource) {
    super(Hashtag, dataSource.createEntityManager());
  }

  async findHashtag(hashtag: string): Promise<Hashtag> {
    try {
      return await this.findOne({
        where: { name: hashtag },
      });
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException(
        'Something went wrong while processing your request. Please try again later.',
      );
    }
  }

  async saveHashtag(hashtag: Hashtag): Promise<Hashtag> {
    try {
      return await this.save(hashtag);
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException(
        'Something went wrong while processing your request. Please try again later.',
      );
    }
  }
}
