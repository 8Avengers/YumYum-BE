import { Collection } from './entities/collection.entity';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm/repository/Repository';
import { User } from '../user/entities/user.entity';
import { CollectionItem } from './entities/collection-item.entity';
import { Post } from '../post/entities/post.entity';
@Injectable()
export class MyListService {
  constructor(
    @InjectRepository(Collection)
    private collectionRepository: Repository<Collection>, //Collection,
    @InjectRepository(CollectionItem)
    private collectionItemRepository: Repository<CollectionItem>, // @InjectRepository(Post) // private postRepository: Repository<Post>,
  ) {}
  /*
    ### 23.03.09
    ### 최호인
    ### MyList 불러오기 (=> 포스트 가져오기)
    */
  async getMyList(userId: number) {
    try {
      //유저의 아이디를 받아왔다. 해당 유저의 마이리스트를 보려고. 유즈가드받으면 필요없다.
      //유저 1번의 정보를 받아서, 만들어둔 MyList들을 보여준다.
      const myLists = await this.collectionRepository.find({
        relations: {
          collectionItems: true,
          // post: true, //포스트를 가져오고 싶다!
        },
      });
      console.log('콘솔로그 :', myLists[0].collectionItems);

      return await myLists;
    } catch (err) {
      console.log(err);
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
  async createMyList(userId, name: string, description: string, image: string) {
    try {
      return this.collectionRepository.insert({
        user: userId,
        name,
        description,
        image,
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
      return this.collectionRepository.update(id, {
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
      const result = await this.collectionRepository.softDelete(id); // soft delete를 시켜주는 것이 핵심입니다!
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
