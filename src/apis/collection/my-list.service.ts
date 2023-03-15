import { Collection } from './entities/collection.entity';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm/repository/Repository';
import { CollectionItem } from './entities/collection-item.entity';
import { Post } from '../post/entities/post.entity';

@Injectable()
export class MyListService {
  constructor(
    @InjectRepository(Collection)
    private collectionRepository: Repository<Collection>,
    @InjectRepository(CollectionItem)
    private collectionItemRepository: Repository<CollectionItem>,
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {}

  /*
    ### 23.03.14
    ### 표정훈
    ### MyList 상세보기 [가게명/평점/포스팅내용/이미지]
    */

  async getMyListsDetail(userId: number, collectionId: number) {
    try {
      const myLists = await this.collectionRepository.find({
        relations: {
          collectionItems: {
            post: true,
            restaurant: true,
          },
        },
        where: {
          user_id: userId,
          deletedAt: null,
          type: 'myList',
          id: collectionId,
        },
        select: { name: true, description: true, image: true },
      });

      // post가 null일 경우 rating 대신 null 값을 반환
      const myListsDetail = myLists.map((list) => ({
        name: list.name,
        description: list.description,
        image: list.image,
        collectionItems: list.collectionItems.map((item) => ({
          id: item.id,
          post: {
            id: item.post?.id ?? null,
            rating: item.post?.rating ?? null,
          },
          restaurant: {
            id: item.restaurant?.id ?? null,
            place_name: item.restaurant?.place_name ?? null,
          },
        })),
      }));
      console.log(myListsDetail);
      return myListsDetail;
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
    ### MyList 상세 더보기(동일한 포스트 불러오기) 🔥
    */

  /* 로직 설명
      1. 맛집상세리스트 PAGE2에 있는 맛집을 클릭한다. (레스토랑ID)
      2. 레스토랑ID에 담긴 해당 유저의 포스팅ID 를 가져온다.
      3. 레스토랑의 정보와 게시물 정보를 가져온다
      레스토랑 정보: 가게이름, 업종(카페), 주소
      포스팅 정보: 설명, 이미지, 평점 ,좋아요, 댓글 등 
    */
  async getMyListsDetailPost(
    userId: number,
    restaurantId: number,
    collectionId: number,
    postId: number,
  ) {
    try {
      const existRestaurant = await this.collectionItemRepository.find({
        where: { id: restaurantId },
      });
      console.log(existRestaurant);
      return existRestaurant;

      // const myLists = await this.collectionRepository.find({
      //   relations: {
      //     collectionItems: {
      //       post: true,
      //       restaurant: true,
      //     },
      //   },
      //   where: {
      //     id: collectionId,
      //     user_id: userId,
      //     deletedAt: null,
      //     type: 'myList',
      //   },
      //   select: { name: true, description: true, image: true },
      // });

      // const collectedPosts = [];
      // for (let i = 0; i < myLists.length; i++) {
      //   if (postId == myLists[0].collectionItems[i].post.id) {
      //     collectedPosts.push(myLists[0].collectionItems[i].post);
      //   }
      // }

      // return myLists;
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException(
        'Something went wrong while processing your request. Please try again later.',
      );
    }
  }

  /*
    ### 23.03.14
    ### 표정훈
    ### MyList 이름조회(내꺼) 👍
    */

  async getMyListsName(userId: number) {
    try {
      const myLists = await this.collectionRepository.find({
        where: { user_id: userId, deletedAt: null, type: 'myList' },
        select: { name: true },
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
    ### 23.03.14
    ### 표정훈
    ### MyList 전체조회(내꺼)
    */

  // 해결해야할 사항 fix:16 fix30
  // 1. post에서 id: 1인 값만 가져옴 => 데이터베이스 수정으로 해결완료🔥
  // 2. post를 3개까지만 제한해서 가져오고 싶음 => map으로 해결완료🔥
  async getMyListsMe(userId: number) {
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

      return myLists.map((collection) => ({
        ...collection,
        collectionItems: collection.collectionItems.slice(0, 3),
      }));
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
    ### MyList 전체조회(남의꺼)
    */

  // 해결해야할 사항 fix:16 fix30
  // 1. post에서 id: 1인 값만 가져옴 => 데이터베이스 수정으로 해결완료🔥
  // 2. post를 3개까지만 제한해서 가져오고 싶음 => map으로 해결완료🔥
  async getMyListsAll(userId: number) {
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

      return myLists.map((collection) => ({
        ...collection,
        collectionItems: collection.collectionItems.slice(0, 3),
      }));
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
  async deleteMyList(userId: number, id: number) {
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

  async myListPlusPosting(postId: number, collectionId: number[]) {
    try {
      for (let i = 0; i < collectionId.length; i++) {
        const item = collectionId[i];

        // // 같은 컬렉션 안에 동일한 포스트는 안들어가는 기능 => 폐기(중복되야함)
        // const existingItem = await this.collectionItemRepository.findOne({
        //   where: {
        //     post: { id: postId },
        //     collection: { id: item },
        //   },
        // });

        // if (existingItem) {
        //   continue; // 이미 존재하는 CollectionItem이면 해당 콜렉션에 추가하지 않고, 다음 콜렉션으로 넘어감
        // }

        const collectionItem = this.collectionItemRepository.create({
          post: { id: postId },
          collection: { id: item },
        });
        await this.collectionItemRepository.save(collectionItem);
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
    ### MyList 포스팅 삭제
    */

  //해당 collectionId일때 일치하는 postId만 삭제하는 기능
  // 🔥주의사항: Number만 삭제 가능🔥
  async myListMinusPosting(postId: number, collectionId: number) {
    try {
      if (collectionId) {
        await this.collectionItemRepository.delete({
          collection: { id: collectionId },
          post: { id: postId },
        });
      } else {
        throw new NotFoundException('해당 컬렉션은 없습니다.');
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
    ### 23.03.15
    ### 표정훈
    ### MyList 포스팅 업데이트(미구현)
    */

  //put이라면 collection 아이디값만 변경하는것 될듯함
  // 컬렉션 해제한 것은 삭제.....는 어떻게 하지?

  async myListUpdatePosting(postId: number, collectionId: number[]) {
    try {
      for (let i = 0; i < collectionId.length; i++) {
        const item = collectionId[i];
        const existingItem = await this.collectionItemRepository.findOne({
          where: {
            post: { id: postId },
            collection: { id: item },
          },
        });
        //중복된 값이 있다면 안들어감 => 이기능은 필요한가? 중복값 받아야겠지?
        if (existingItem) {
          continue; // 이미 존재하는 CollectionItem이면 해당 콜렉션에 추가하지 않고, 다음 콜렉션으로 넘어감
        }

        //이부분을 업데이트로 해서 컬렉션 값만 바꾸면 될듯?
        const collectionItem = this.collectionItemRepository.create({
          post: { id: postId },
          collection: { id: item },
        });
        await this.collectionItemRepository.save(collectionItem);
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
