import { InjectRepository } from '@nestjs/typeorm';
import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { Post } from '../post/entities/post.entity';
import { Collection } from './entities/collection.entity';
import { CollectionItem } from './entities/collection-item.entity';
@Injectable()
export class BookmarkService {
  constructor(
    @InjectRepository(Collection)
    private collectionRepository: Repository<Collection>,
    @InjectRepository(CollectionItem)
    private collectionItemRepository: Repository<CollectionItem>, // @InjectRepository(Post) // private postRepository: Repository<Post>, // private imageRepository: ImageRepository, // private readonly uploadService: UploadService,
  ) {}

  /*
    ### 23.03.22
    ### 표정훈
    ### 북마크 전체 보기🔥🔥🔥
    */
  async getBookmarks(userId: number) {
    try {
      //
      const bookmarks = await this.collectionItemRepository.find({
        relations: {
          post: {
            images: true,
          },
          collection: true,
        },
        where: {
          collection: {
            user_id: userId,
            deletedAt: null,
            type: 'bookmark',
          },
        },
        select: {
          collection: {
            id: true,
            name: true,
          },
          post: {
            id: true,
            images: { id: true, file_url: true },
          },
        },
      });

      const newBookmarks = bookmarks.map((item) => {
        const {
          collection: { id, name },
          post,
        } = item;
        return {
          id,
          name,
          image:
            post?.images && post?.images?.length > 0
              ? post?.images[0].file_url
              : '',
        };
      });
      return newBookmarks;
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException(
        'Something went wrong while processing your request. Please try again later.',
      );
    }
  }
  /*
      ### 23.03.22
      ### 표정훈
      ### 북마크 상세 보기 🔥
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
        select: {
          id: true,
          type: true,
          collectionItems: {
            id: true,
            post: {
              id: true,
              content: true,
              rating: true,
            },
            restaurant: {
              id: true,
              place_name: true,
            },
          },
        },
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
      ### 북마크 생성
      */
  createCollection(
    userId: number,
    name: string,
    type: string,
    visibility: string,
  ) {
    return this.collectionRepository.insert({
      user_id: userId,
      name: name,
      type: 'bookmark',
      visibility: 'private',
    });
  }

  /*
          ### 23.03.08
          ### 표정훈
          ### 북마크 수정
          */
  async updateCollection(collectionId: number, name: string) {
    try {
      const bookmarkUpdate = await this.collectionRepository.update(
        { id: collectionId },
        {
          name: name,
        },
      );
      if (bookmarkUpdate.affected === 0) {
        throw new NotFoundException('북마크가 없습니다.');
      }

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
  }
  /*
          ### 23.03.08
          ### 표정훈
          ### 북마크 삭제
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
        ### 23.03.22
        ### 표정훈
        ### 기본 북마크에 포스팅 더하기
        */
  async basicCollectionPlusPosting(postId: number, userId: number) {
    try {
      //본인의 첫번째 북마크(모든 게시물)의 id를 찾는다.
      const basicBookmark = await this.collectionRepository.findOne({
        where: {
          user_id: userId,
        },
        select: {
          id: true,
        },
      });

      const existingItem = await this.collectionItemRepository.findOne({
        where: {
          post: { id: postId },
          collection: { id: basicBookmark.id }, // 기본 북마크의 ID를 사용하여 조건문을 지정
        },
      });

      if (existingItem) {
        return; // 이미 있다면 종료
      }

      const collectionItem = this.collectionItemRepository.create({
        post: { id: postId },
        collection: { id: basicBookmark.id }, // 기본 북마크의 ID를 사용하여 컬렉션 아이템을 생성
      });

      await this.collectionItemRepository.save(collectionItem);
      return collectionItem;
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
        ### 23.03.22
        ### 표정훈
        ### 기본 북마크에 포스팅 빼기
        */
  async basicCollectionMinusPosting(postId: number, userId: number) {
    try {
      //본인의 첫번째 북마크(모든 게시물)의 id를 찾는다.
      const basicBookmark = await this.collectionRepository.findOne({
        where: {
          user_id: userId,
        },
        select: {
          id: true,
        },
      });

      const existingItem = await this.collectionItemRepository.findOne({
        where: {
          post: { id: postId },
          collection: { id: basicBookmark.id }, // 기본 북마크의 ID를 사용하여 조건문을 지정
        },
      });

      if (existingItem) {
        await this.collectionItemRepository.remove(existingItem); // 기존 아이템이 있다면 삭제
      }

      return;
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
        ### 23.03.22
        ### 표정훈
        ### 북마크에 포스팅 더하기
        */
  async collectionPlusPosting(collectionId: number, postId: number) {
    try {
      const existingItem = await this.collectionItemRepository.findOne({
        where: {
          collection: { id: collectionId },
          post: { id: postId },
        },
      });

      if (existingItem) {
        return; // 이미 있다면 종료
      }

      const collectionItem = this.collectionItemRepository.create({
        collection: { id: collectionId },
        post: { id: postId },
      });

      await this.collectionItemRepository.save(collectionItem);
      return collectionItem;
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
        ### 북마크에 포스팅 빼기
        */
  async collectionMinusPosting(collectionId: number, postId: number) {
    try {
      const deletePost = await this.collectionItemRepository.delete({
        collection: { id: collectionId },
        post: { id: postId },
      });
      return deletePost;
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

  //드보라님 코드🔥🔥🔥
  async isAllPostsBookmarkedByUser(
    userId: number,
    postIds: number[],
  ): Promise<{ postId: number; isBookmarked: string }[]> {
    const bookmarkCollection = await this.collectionRepository.findOne({
      where: { type: 'bookmark', user_id: userId },
    });
    if (!bookmarkCollection) {
      return postIds.map((postId) => {
        return { postId, isBookmarked: 'False' };
      });
    }

    const bookmarkCollectionItems = await this.collectionItemRepository.find({
      where: {
        collection: { id: bookmarkCollection.id },
        post: { id: In(postIds) },
      },
      relations: ['post', 'collection'],
    });

    return postIds.map((postId) => {
      const isBookmarked = bookmarkCollectionItems.some(
        (bookmark) => bookmark.post.id === postId,
      );
      return { postId, isBookmarked: isBookmarked ? 'True' : 'False' };
    });
  }

  async isOnePostBookmarkedByUser(userId: number, postId: number) {
    const bookmarkCollection = await this.collectionRepository.findOne({
      where: { type: 'bookmark', user_id: userId },
    });
    if (!bookmarkCollection) {
      return { isBookmarked: 'False' };
    }

    const bookmarkCollectionItem = await this.collectionItemRepository.findOne({
      where: {
        collection: { id: bookmarkCollection.id },
        post: { id: postId },
      },
      relations: ['post', 'collection'],
    });

    return { isBookmarked: bookmarkCollectionItem ? 'True' : 'False' };
  }
}
