import { Restaurant } from 'src/apis/restaurant/entities/restaurant.entity';
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
import { In } from 'typeorm';
import { Comment } from '../comment/entities/comment.entity';
import { PostLikeService } from '../post/post-like.service';
import { ImageRepository } from '../post/image.repository';
import { PostHashtagService } from '../post/post-hashtag.service';
import { RestaurantService } from '../restaurant/restaurant.service';
import { UploadService } from '../upload/upload.service';
import { FindOptionsRelations } from 'typeorm';
import { FindManyOptions } from 'typeorm';

@Injectable()
export class MyListService {
  constructor(
    @InjectRepository(Collection)
    private collectionRepository: Repository<Collection>,
    @InjectRepository(CollectionItem)
    private collectionItemRepository: Repository<CollectionItem>,
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(Comment) private commentRepository: Repository<Comment>,
    private readonly likeService: PostLikeService,
    private imageRepository: ImageRepository,
    private readonly postHashtagService: PostHashtagService,
    private readonly restaurantService: RestaurantService,
    private readonly uploadService: UploadService,
  ) {}

  /*
    ### 23.03.19
    ### 표정훈, 이드보라
    ### MyList 상세보기
    */

  async getMyListDetail(userId: number, collectionId: number) {
    try {
      // 컬렉션 이름과 포스트 정보 가져오기
      const myList = await this.collectionRepository.find({
        relations: {
          collectionItems: {
            post: { images: true, restaurant: true },
          },
        },
        where: {
          id: collectionId,
          user_id: userId,
          deletedAt: null,
          type: 'myList',
        },
        select: {
          id: true,
          name: true,
          visibility: true,
          collectionItems: {
            id: true,
            post: {
              id: true,
              content: true,
              rating: true,
              images: true,
              restaurant: {
                id: true,
                x: true,
                y: true,
                place_name: true,
              },
            },
          },
        },
      });

      return myList.map((myList) => ({
        id: myList.id,
        name: myList.name,
        visibility: myList.visibility,
        post: myList.collectionItems.map((item) => ({
          ...item.post,
          restaurant: item.post.restaurant,
          images: item.post.images,
        })),
      }));
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException(
        'Something went wrong while processing your request. Please try again later.',
      );
    }
  }

  /*
    ### 23.03.15
    ### 표정훈
    ### MyList 상세 더보기(동일한 포스트 불러오기) 🔥
    */

  async getMyListsDetailPost(
    userId: number,
    restaurantId: number,
    collectionId: number,
  ) {
    //컬렉션아이템에서 맛집아이디에 관한 정보 찾기
    try {
      const posts = await this.postRepository.find({
        where: { deleted_at: null, visibility: 'public', user: { id: userId } },
        select: {
          id: true,
          content: true,
          rating: true,
          updated_at: true,
          visibility: true,
          restaurant: {
            kakao_place_id: true,
            address_name: true,
            category_name: true,
            place_name: true,
            road_address_name: true,
          },
          user: { id: true, nickname: true, profile_image: true },
          images: { id: true, file_url: true },
          collectionItems: { id: true, collection: { id: true } },
        },
        relations: {
          user: true,
          restaurant: true,
          hashtags: true,
          comments: true,
          images: true,
          collectionItems: {
            collection: true,
          },
        },
        order: { created_at: 'desc' },
      });
      if (!posts || posts.length === 0) {
        return [];
      }
      const postIds = posts.map((post) => post.id);

      const postLikes = await this.likeService.getLikesForAllPosts(postIds);

      const likedStatuses = await this.likeService.getLikedStatusforAllPosts(
        postIds,
        userId,
      );

      return posts.map((post) => {
        const hashtags = post.hashtags.map((hashtag) => hashtag.name);
        const likes =
          postLikes.find((like) => like.postId === post.id)?.totalLikes || 0;
        const isLiked =
          likedStatuses.find((status) => status.postId === post.id)?.isLiked ||
          'False';
        const totalComments = post.comments ? post.comments.length : 0;
        return {
          id: post.id,
          content: post.content,
          rating: post.rating,
          updated_at: post.updated_at,
          user: post.user,
          restaurant: post.restaurant,
          images: post.images,
          hashtags,
          totalLikes: likes,
          isLiked,
          totalComments,
          myList: post.collectionItems,
          visibility: post.visibility,
        };
      });
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
        select: { id: true, name: true },
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

        // 같은 컬렉션 안에 동일한 포스트는 안들어가는 기능 => 폐기(중복되야함)
        const existingItem = await this.collectionItemRepository.findOne({
          where: {
            post: { id: postId },
            collection: { id: item },
          },
        });

        if (existingItem) {
          continue; // 이미 존재하는 CollectionItem이면 해당 콜렉션에 추가하지 않고, 다음 콜렉션으로 넘어감
        }

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
    ### 23.03.17
    ### 표정훈
    ### MyList 포스팅 업데이트🔥
    */

  /* 로직 설명
      1. 입력받은 값으로 컬렉션에 있는 포스트아이디를 모두 찾는다
      2. 컬렉션아이템에서 해당 포스트 아이디로 검색되는거 다지운다.
      3. 입력 받은 값을 저장한다.
      이슈: 자신의 포스터만 마이리스트에 저장할 수 있기에 가능, 데이터 낭비코드이긴 함ㅠㅠ
      */
  async myListUpdatePosting(postId: number, collectionId: number[]) {
    try {
      // 1. 입력받은 값으로 컬렉션아이템에 있는 포스트아이디를 모두 찾는다.
      const findPostId = await this.collectionItemRepository.find({
        relations: ['post', 'collection'],
        where: {
          post: { id: postId },
          collection: { type: 'myList' }, //마이리스트 일때만!
        },
      });

      // 2. 컬렉션아이템에서 해당 포스트 아이디로 검색되는거 다지운다.
      await this.collectionItemRepository.remove(findPostId);
      // 3. 입력받은 정보로 모두 넣어준다.
      this.myListPlusPosting(postId, collectionId);
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
}
