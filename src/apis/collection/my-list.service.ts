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
import { CreateMyListDto } from './dto/create-my-list.dto';
import { In } from 'typeorm';
@Injectable()
export class MyListService {
  constructor(
    @InjectRepository(Collection)
    private collectionRepository: Repository<Collection>, //Collection,
    @InjectRepository(CollectionItem)
    private collectionItemRepository: Repository<CollectionItem>, // @InjectRepository(Post) // private postRepository: Repository<Post>,
  ) {}
  /*
    ### 23.03.10
    ### 표정훈
    ### MyList 전체조회(해당 유저의 맛집리스트만 불러오기)
    */

  async getMyList(userId: number) {
    try {
      const myLists = await this.collectionRepository.find({
        relations: {
          collectionItems: {
            post: true,
            restaurant: true,
          },
        },
        where: { user_id: userId, deletedAt: null, type: 'myList' },
        select: { name: true, description: true, image: true },
      });

      // for (let i = 0; i < myLists.length; i++) {
      //   return [
      //     myLists,
      //     myLists[i].collectionItems[i].post.rating,
      //     myLists[i].collectionItems[i].restaurant.name,
      //   ];
      // }
      // console.log(myLists[0]);
      return [
        myLists,
        // myLists[0].collectionItems[0].post.rating,
        // myLists[0].collectionItems[0].restaurant.name,
      ];
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException(
        'Something went wrong while processing your request. Please try again later.',
      );
    }
  }

  /*
    ### 23.03.10
    ### 표정훈
    ### MyList 생성
    */
  async createMyList(userId: number, name: string, type: 'myList') {
    try {
      const myLists = await this.collectionRepository.insert({
        user_id: userId,
        name,
        type: 'myList',
      });
      return myLists;
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException(
        'Something went wrong while processing your request. Please try again later.',
      );
    }
  }

  /*
    ### 23.03.10
    ### 표정훈
    ### MyList 수정
    */
  //🔥문제 발생할만한 부분: myListId는 collectionId와 같아서 문제🔥
  // 예) 1번유저 마이리스트 검색후, 1번의 3번째 마이리스트 수정
  async updateMyList(
    userId: number,
    collectionId: number,
    name: string,
    image: string,
    description: string,
    visibility: 'public' | 'private',
  ) {
    try {
      // id와 type이 모두 일치하는 Collection 엔티티를 찾는다.
      const myList = await this.collectionRepository.find({
        relations: {
          user: true,
        },
      });

      if (!myList) {
        throw new NotFoundException('마이리스트가 없습니다.');
      }

      await this.collectionRepository.update(
        { id: collectionId },
        {
          name,
          image,
          description,
          visibility,
        },
      );
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw err;
      } else {
        console.error(err);
        throw new InternalServerErrorException(
          'Something went wrong while processing your request. Please try again later.',
        );
      }
    }
  }

  /*
    ### 23.03.10
    ### 표정훈
    ### MyList 삭제
    */
  async deleteMyList(id: number) {
    try {
      const result = await this.collectionRepository.softDelete(id); // soft delete를 시켜주는 것이 핵심입니다!
      if (result.affected === 0) {
        throw new NotFoundException('마이리스트가 없습니다.');
      }
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw err;
      } else {
        console.error(err);
        throw new InternalServerErrorException(
          'Something went wrong while processing your request. Please try again later.',
        );
      }
    }
  }

  /*
    ### 23.03.10
    ### 표정훈
    ### MyList 포스팅 추가
    */
  // 컬렉션아이디 에다가 포스팅 정보를 넘겨야함
  async myListPlusPosting(postId: number, collectionId: number[]) {
    try {
      for (let i = 0; i < collectionId.length; i++) {
        let item = collectionId[i];

        await this.collectionItemRepository.insert({
          post: { id: postId },
          collection: { id: item },
        });
      }
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw err;
      } else {
        console.error(err);
        throw new InternalServerErrorException(
          'Something went wrong while processing your request. Please try again later.',
        );
      }
    }
  }
}

// async 데이터찾기(userId: number) {
//   try {

// const myLists = await this.collectionRepository.find({
//   relations: {
//     collectionItems: {
//       post: true,
//     },
//     user: true,
//   },
//   where: {
//     user: {
//       id: userId,
//     },
//   },
// });

// return myLists;
//   } catch (err) {
//     console.log(err);
//     throw new InternalServerErrorException(
//       'Something went wrong while processing your request. Please try again later.',
//     );
//   }
// }
