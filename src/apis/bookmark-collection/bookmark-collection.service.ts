import { BookmarkCollection } from './entities/bookmark-collection.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

@Injectable()
export class CollectionService {
  constructor(
    @InjectRepository(BookmarkCollection)
    private collectionRepository: Repository<BookmarkCollection>,
  ) {}

  /*
    ### 23.03.08
    ### 표정훈
    ### 컬렉션 전체 보기
    */
  async getBookmarks() {
    return await this.collectionRepository.find({
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
    return await this.collectionRepository.find({
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
    return this.collectionRepository.insert({
      name,
    });
  }
  /*
    ### 23.03.08
    ### 표정훈
    ### 컬렉션 수정
    */
  async updateCollection(id: number, name: string) {
    return await this.collectionRepository.update({ id }, { name });
  }
  /*
    ### 23.03.08
    ### 표정훈
    ### 컬렉션 삭제
    */
  async deleteCollection(id: number) {
    return await this.collectionRepository.softDelete(id);
  }
}
