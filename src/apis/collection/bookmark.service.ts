import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
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

  // async getMyList(userId: number) {
  //   try {
  //     const myLists = await this.collectionRepository.find({
  //       relations: {
  //         collectionItems: {
  //           post: true,
  //           restaurant: true,
  //         },
  //       },
  //       where: { user_id: userId, deletedAt: null, type: 'myList' },
  //       select: { name: true, description: true, image: true },
  //     });

  //     return myLists;
  //   }

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
  async getCollections(id: number) {
    return await this.collectionRepository.find({
      where: { id, deletedAt: null },
      // select: ['name'],
    });
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
  async updateCollection(id: number, name: string) {
    // return await this.bookmarkRepository.update({ id }, { name });
  }
  /*
      ### 23.03.08
      ### 표정훈
      ### 컬렉션 삭제
      */
  async deleteCollection(id: number) {
    return await this.collectionRepository.softDelete(id);
  }

  async collectionPlusPosting(collectionId: number, postId: number) {
    const newBookmark = await this.collectionRepository.findOneBy({
      id: postId,
    });
    const collection = await this.collectionRepository.findOneBy({
      id: collectionId,
    });
    console.log('나는 콘솔', newBookmark, collection);
    await this.collectionRepository.save(collection);

    // return await this.bookmarkRepository.insert({
    //   id,
    //   // postId,
    // });
  }
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
