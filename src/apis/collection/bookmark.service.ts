import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Post } from '../post/entities/post.entity';
import { CollectionItem } from './entities/collection-item.entity';

@Injectable()
export class BookmarkService {
  constructor(
    @InjectRepository(CollectionItem)
    private bookmarkRepository: Repository<CollectionItem>,
    @InjectRepository(Post) private postRepository: Repository<Post>,
  ) {}

  /*
    ### 23.03.08
    ### 표정훈
    ### 컬렉션 전체 보기
    */
  async getBookmarks() {
    return await this.bookmarkRepository.find({
      where: { deleted_at: null },
      // select: ['name'],
    });
  }
  /*
      ### 23.03.08
      ### 표정훈
      ### 컬렉션 상세 보기
      */
  async getCollections(id: number) {
    return await this.bookmarkRepository.find({
      where: { id, deleted_at: null },
      // select: ['name'],
    });
  }
  /*
      ### 23.03.08
      ### 표정훈
      ### 컬렉션 생성
      */
  createCollection(name: string) {
    return this.bookmarkRepository.insert({
      name,
    });
  }
  /*
      ### 23.03.08
      ### 표정훈
      ### 컬렉션 수정
      */
  async updateCollection(id: number, name: string) {
    return await this.bookmarkRepository.update({ id }, { name });
  }
  /*
      ### 23.03.08
      ### 표정훈
      ### 컬렉션 삭제
      */
  async deleteCollection(id: number) {
    return await this.bookmarkRepository.softDelete(id);
  }

  async collectionPlusPosting(collectionId: number, postId: number) {
    const newBookmark = await this.postRepository.findOneBy({ id: postId });
    const collection = await this.bookmarkRepository.findOneBy({
      id: collectionId,
    });
    console.log('나는 콘솔', newBookmark, collection);
    await this.bookmarkRepository.save(collection);

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
