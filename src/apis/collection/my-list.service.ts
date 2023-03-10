import { Collection as MyList } from './entities/collection.entity';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm/repository/Repository';
@Injectable()
export class MyListService {
  constructor(
    @InjectRepository(MyList) private myListRepository: Repository<MyList>,
  ) {}
  /*
    ### 23.03.09
    ### 최호인
    ### MyList 불러오기
    */
  async getMyList(userId) {
    try {
      userId = Number(userId);
      console.log(userId);
      return await this.myListRepository.find({
        where: { user: userId },
      });
    } catch (err) {
      throw new InternalServerErrorException(
        'Something went wrong while processing your request. Please try again later.',
      );
    }
  }

  /*
    ### 23.03.09
    ### 최호인
    ### MyList 생성
    */
  async createMyList(userId, name: string, description: string, img: string) {
    try {
      return this.myListRepository.insert({
        user: userId,
        name,
        description,
        // img_url: img,
      });
    } catch (err) {
      throw new InternalServerErrorException(
        'Something went wrong while processing your request. Please try again later.',
      );
    }
  }

  /*
    ### 23.03.09
    ### 최호인
    ### MyList 수정
    */
  async updateMyList(
    id: number,
    name: string,
    description: string,
    img: string,
  ) {
    try {
      return this.myListRepository.update(id, {
        name,
        description,
        // img_url: img,
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

  async deleteMyList(id: number) {
    try {
      const result = await this.myListRepository.softDelete(id); // soft delete를 시켜주는 것이 핵심입니다!
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