import { InjectRepository } from '@nestjs/typeorm';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Post } from '../post/entities/post.entity';
import { Collection } from './entities/collection.entity';
import { CollectionItem } from './entities/collection-item.entity';

@Injectable()
export class BookmarkService {
  constructor(
    @InjectRepository(Collection)
    private collectionRepository: Repository<Collection>,
    @InjectRepository(CollectionItem)
    private collectionItemRepository: Repository<CollectionItem>,
  ) {}

  /*
    ### 23.03.08
    ### 표정훈
    ### 컬렉션 전체 보기
    */
  async getBookmarks(userId: number) {
    try {
      const bookmarks = await this.collectionRepository.find({
        relations: {
          collectionItems: {
            post: true,
            restaurant: true,
          },
        },
        where: { user_id: userId, deletedAt: null, type: 'bookmark' },
        select: { name: true, image: true },
      });
      return bookmarks;
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException(
        'Something went wrong while processing your request. Please try again later.',
      );
    }
  }
  /*
      ### 23.03.08
      ### 표정훈
      ### 컬렉션 상세 보기
      */
  async getCollections(collectionId: number) {
    try {
      const bookmark = await this.collectionRepository.find({
        relations: {
          collectionItems: {
            post: true,
            restaurant: true,
          },
        },
        where: { id: collectionId, deletedAt: null, type: 'bookmark' },
      });

      return bookmark;
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw err;
      }
      throw new InternalServerErrorException(
        'Something went wrong while processing your request. Please try again later.',
      );
    }
  }
  /*
      ### 23.03.13
      ### 표정훈
      ### 컬렉션 생성
      */
  createCollection(userId: number, name: string, type: string) {
    return this.collectionRepository.insert({
      user_id: userId,
      name: name,
      type: 'bookmark',
    });
  }

  /*
      ### 23.03.08
      ### 표정훈
      ### 컬렉션 수정
      */
  async updateCollection(collectionId: number, name: string) {
    try {
      const bookmarkUpdate = await this.collectionRepository.update(
        { id: collectionId },
        {
          name,
        },
      );
      return bookmarkUpdate;
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
    // return await this.bookmarkRepository.update({ id }, { name });
  }
  /*
      ### 23.03.08
      ### 표정훈
      ### 컬렉션 삭제
      */
  async deleteCollection(collectionId: number) {
    try {
      const result = await this.collectionRepository.softDelete(collectionId); // soft delete를 시켜주는 것이 핵심입니다!
      if (result.affected === 0) {
        throw new NotFoundException('북마크가 없습니다.');
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
    ### 23.03.13
    ### 표정훈
    ### 컬렉션에 포스팅 더하기
    */
  //   async myListPlusPosting(postId: number, collectionId: number[]) {
  //     try {
  //       for (let i = 0; i < collectionId.length; i++) {
  //         let item = collectionId[i];

  //         await this.collectionItemRepository.insert({
  //           post: { id: postId },
  //           collection: { id: item },
  //         });
  //       }
  //     } catch (err) {
  //       if (err instanceof NotFoundException) {
  //         throw err;
  //       } else {
  //         console.error(err);
  //         throw new InternalServerErrorException(
  //           'Something went wrong while processing your request. Please try again later.',
  //         );
  //       }
  //     }
  //   }
  // }

  async collectionPlusPosting(collectionId: number, postId: number) {}
  async collectionPlusRestaurant(id: number, restaurantId: number) {}
  collectionMinusPosting(id: number, postId: number) {}
  collectionMinusRestaurant(id: number, restaurantId: number) {}
}

/*
collectionPlusPosting 컬렉션에 포스팅 더하기
collectionPlusRestaurant 컬렉션에 맛집 더하기
collectionMinusPosting 컬렉션에 포스팅 빼기
collectionMinusRestaurant 컬렉션에 맛집 빼기
*/
