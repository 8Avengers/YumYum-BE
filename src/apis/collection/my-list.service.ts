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
        select: { id: true, name: true },
      });

      // 해당 postId랑 일치하는 이미지 가져오기
      const postImage = await this.imageRepository.find({
        where: {
          post: { id: myLists[0].collectionItems[0].post.id },
        },
      });

      // post가 null일 경우 rating 대신 null 값을 반환
      const myListsDetail = myLists.map((list) => ({
        id: list.id,
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
      console.log(myListsDetail, postImage);
      return [myListsDetail, postImage];
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException(
        'Something went wrong while processing your request. Please try again later.',
      );
    }
  }

  /*
  ### 23.03.13
  ### 이드보라
  ### 포스팅 상세보기.좋아요 기능 추가. 불러오는 유저 정보 수정
  hashtags 135번째 문제발생...
  */
  async getPostById(postId: number, userId: number) {
    try {
      const post = await this.postRepository.find({
        where: { id: postId, deleted_at: null, visibility: 'public' },
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
          images: true,
          collectionItems: {
            collection: true,
          },
        },
      });

      if (!post) {
        throw new NotFoundException(`존재하지 않는 포스트입니다.`);
      }

      const totalLikes = await this.likeService.getLikesForPost(postId);

      const hashtags = post[0].hashtags.map(({ name }) => ({ name }));

      const { isLiked } = await this.likeService.getLikedStatusforOnePost(
        postId,
        userId,
      );

      const totalComments = await this.commentRepository.count({
        where: { deleted_at: null, post: { id: postId } },
      });

      return {
        id: post[0].id,
        content: post[0].content,
        rating: post[0].rating,
        updated_at: post[0].updated_at,
        user: post[0].user,
        restaurant: post[0].restaurant,
        images: post[0].images,
        totalLikes,
        hashtags,
        isLiked,
        totalComments,
        myList: post[0].collectionItems,
        visibility: post[0].visibility,
      };
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
    ### MyList 상세 더보기(동일한 포스트 불러오기) 🔥
    */

  /* 로직 설명
      1. 맛집상세리스트 PAGE2에 있는 맛집을 클릭한다. (레스토랑ID)
      2. 콜렉션 아이템에 있는 레스토랑아이디와 콜렉션아이디가 둘다 일치하는 정보를 찾는다.
      3. 레스토랑의 정보와 게시물 정보를 가져온다
      레스토랑 정보: 가게이름, 업종(카페), 주소
      포스팅 정보: 설명, 이미지, 평점 ,좋아요, 댓글 등 
    */
  async getMyListsDetailPost(
    userId: number,
    restaurantId: number,
    collectionId: number,
  ) {
    try {
      //컬렉션아이템에서 맛집아이디에 관한 정보 찾기
      const existRestaurant = await this.collectionItemRepository.find({
        where: {
          restaurant: { id: restaurantId },
          collection: { id: collectionId },
        },
        select: {
          post: {
            id: true,
            content: true,
            rating: true,
            restaurant: {
              id: true,
              address_name: true,
              category_name: true,
              kakao_place_id: true,
              place_name: true,
              road_address_name: true,
            },
            user: { id: true, nickname: true, profile_image: true },
          },
        },
        relations: ['restaurant', 'post'],
      });

      return existRestaurant;
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
      await this.myListPlusPosting(postId, collectionId);
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
