import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Bookmark } from './entities/bookmark.entity';
import { Repository } from 'typeorm';
import { Post } from '../post/entities/post.entity';

@Injectable()
export class BookmarkService {
  constructor(
    @InjectRepository(Bookmark)
    private bookmarkRepository: Repository<Bookmark>,
    @InjectRepository(Post) private postRepository: Repository<Post>,
  ) {}

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

//save()저장 remove()제거
/*
collectionPlusPosting 컬렉션에 포스팅 더하기
collectionPlusRestaurant 컬렉션에 맛집 더하기
collectionMinusPosting 컬렉션에 포스팅 빼기
collectionMinusRestaurant 컬렉션에 맛집 빼기
*/
