import { Follow } from './../user/entities/follow.entity';
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
import { In, MoreThan } from 'typeorm';
import { Comment } from '../comment/entities/comment.entity';
import { PostLikeService } from '../post/post-like.service';
import { ImageRepository } from '../post/image.repository';
import { PostHashtagService } from '../post/post-hashtag.service';
import { RestaurantService } from '../restaurant/restaurant.service';
import { UploadService } from '../upload/upload.service';
import { FindOptionsRelations } from 'typeorm';
import { FindManyOptions } from 'typeorm';
import { User } from '../user/entities/user.entity';

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
    @InjectRepository(Follow)
    private followRepository: Repository<Follow>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
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

  async getMyListDetail(collectionId: number, page: string) {
    try {
      let pageNum = Number(page) - 1;
      const myListInOnePage = 1; //세준님에게 물어보기

      if (isNaN(pageNum) || pageNum < 0) {
        pageNum = 0;
      }

      // 컬렉션 이름과 포스트 정보 가져오기
      const myList = await this.collectionRepository.find({
        relations: {
          collectionItems: {
            post: { images: true, restaurant: true },
          },
        },
        where: {
          id: collectionId,
          // user_id: userId,
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
        skip: pageNum * myListInOnePage,
        take: myListInOnePage,
      });

      //첫 대괄호 없애기위해 객체 형태로 변경
      const [myListDetail] = myList.map((myList) => ({
        id: myList.id,
        name: myList.name,
        visibility: myList.visibility,
        post: myList.collectionItems.map((item) => ({
          ...item.post,
          restaurant: item.post.restaurant,
          images: item.post.images,
        })),
      }));

      return myListDetail;
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException(
        'Something went wrong while processing your request. Please try again later.',
      );
    }
  }

  /*
    ### 23.03.20
    ### 표정훈/이드보라
    ### MyList 상세 더보기(동일한 포스트 불러오기) 🔥
    - 뉴스피드 형식으로 이드보라님 코드 가져옴
    */

  async getMyListsDetailPost(
    userId: number,
    restaurantId: number,
    collectionId: number,
    page: string,
  ) {
    //컬렉션아이템에서 맛집아이디에 관한 정보 찾기
    try {
      let pageNum = Number(page) - 1;
      const myListInOnePage = 3; //세준님에게 물어보기

      if (isNaN(pageNum) || pageNum < 0) {
        pageNum = 0;
      }

      const posts = await this.postRepository.find({
        where: {
          deleted_at: null,
          visibility: 'public',
          user: { id: userId },
          restaurant: { id: restaurantId },
          collectionItems: { collection: { id: collectionId } },
        },
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
        // order: { created_at: 'desc' },
        skip: pageNum * myListInOnePage,
        take: myListInOnePage,
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
  async getMyListsMe(userId: number, page: string) {
    try {
      // let pageNum = Number(page) - 1;
      // const myListInOnePage = 3;

      // //이미지, 레스토랑 id, place_name
      // if (isNaN(pageNum) || pageNum < 0) {
      //   pageNum = 0;
      // }

      const myLists = await this.collectionRepository.find({
        relations: {
          collectionItems: {
            post: true,
            restaurant: true,
          },
        },
        where: { user_id: userId, deletedAt: null, type: 'myList' },
        select: { id: true, name: true, description: true, image: true },
        // skip: pageNum * myListInOnePage,
        // take: myListInOnePage,
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
    ### MyList 전체조회(남의꺼)
    */
  async getMyListsAll(userId: number, page: string) {
    try {
      // let pageNum = Number(page) - 1;
      // const myListInOnePage = 3; //세준님에게 물어보기

      // if (isNaN(pageNum) || pageNum < 0) {
      //   pageNum = 0;
      // }

      const myLists = await this.collectionRepository.find({
        relations: {
          collectionItems: {
            post: {
              images: true,
              restaurant: true,
            },
          },
        },
        where: { user_id: userId, deletedAt: null, type: 'myList' },
        select: {
          id: true,
          name: true,
          description: true,
          collectionItems: {
            id: true,
            post: {
              id: true,
              rating: true,
              images: { id: true, file_url: true },
              restaurant: {
                place_name: true,
              },
            },
          },
        },
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
    ### 23.03.20
    ### 표정훈
    ### MyList 수정조회
    */

  async getMyListInfo(collectionId: number) {
    try {
      const myListCheck = await this.collectionRepository.findOne({
        select: {
          id: true,
          name: true,
          description: true,
          image: true,
        },
        where: {
          id: collectionId,
        },
      });

      return myListCheck;
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
    file,
  ) {
    try {
      // 이미 생성된 컬렉션을 찾는다.
      const myListInfo = await this.collectionRepository.findOne({
        where: {
          id: collectionId,
          type: 'myList',
          user: { id: userId },
        },
      });

      // 입력받은 정보를 myListInfo에 담는다.
      if (myListInfo) {
        myListInfo.name = name;
        myListInfo.description = description;
        myListInfo.visibility = visibility;
        if (file) {
          const uploadedFile = await this.uploadService.uploadMyListImageToS3(
            'yumyumdb-myList', //AmazonS3의 저장되는 폴더명
            file,
          );
          myListInfo.image = uploadedFile.myListImage;
        }
      } else {
        myListInfo.image = myListInfo.image;
      }
      // 담은 정보를 저장한다.
      const updateMyListInfo = await this.collectionRepository.save(myListInfo);
      console.log('updateMyListInfo 정보:::::::::', updateMyListInfo);

      return {
        name: updateMyListInfo.name,
        image: updateMyListInfo.image,
        description: updateMyListInfo.description,
        visibility: updateMyListInfo.visibility,
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
    ### 23.03.10
    ### 표정훈
    ### MyList 삭제
    */
  async deleteMyList(collectionId: number) {
    try {
      const deleteResult = await this.collectionItemRepository.delete({
        collection: { id: collectionId },
      });

      if (deleteResult.affected === 0) {
        throw new NotFoundException('마이리스트가 없습니다.');
      }

      return deleteResult;
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
      const collectionItems = [];

      for (let i = 0; i < collectionId.length; i++) {
        const item = collectionId[i];

        const existingItem = await this.collectionItemRepository.findOne({
          where: {
            post: { id: postId },
            collection: { id: item },
          },
        });

        if (existingItem) {
          continue;
        }

        const collectionItem = this.collectionItemRepository.create({
          post: { id: postId },
          collection: { id: item },
        });

        await this.collectionItemRepository.save(collectionItem);
        collectionItems.push(collectionItem);
      }

      return collectionItems;
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

  /*
    ### 23.03.20
    ### 표정훈
    ### [Main] 요즘 뜨는 맛집리스트🔥
    */
  async HotMyList() {
    try {
      // 1달 전 날짜를 구한다
      const oneMonthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

      // 컬렉션과 게시물, 좋아요 정보를 가져온다
      const myListSumLikes = await this.collectionItemRepository.find({
        relations: {
          post: {
            postLikes: true,
            user: true,
            images: true,
          },
          collection: {
            user: true,
          },
        },
        where: {
          // 컬렉션 타입이 myList 이면서 삭제되지 않은 것을 가져온다
          collection: {
            type: 'myList',
            deletedAt: null,
          },
          post: {
            // 좋아요가 삭제되지 않았고, 1달 이내에 좋아요 업데이트된 게시물만 가져온다
            postLikes: {
              deleted_at: null,
              updated_at: MoreThan(oneMonthAgo),
            },
          },
        },
        select: {
          id: true,
          post: {
            id: true,
            images: { id: true, file_url: true },
            postLikes: {
              id: true,
            },
            user: {
              id: true,
              nickname: true,
            },
          },
          collection: {
            id: true,
            name: true,
            user: {
              id: true,
              nickname: true,
            },
          },
        },
        take: 2,
      });

      // 컬렉션별 좋아요 수를 합산하여 그룹화한다
      const groupedData = myListSumLikes.reduce((groups: any, item: any) => {
        const collectionId = item.collection.id;
        if (!groups[collectionId]) {
          groups[collectionId] = {
            collection: item.collection,
            user: item.collection.user,
            sumLikes: 0,
          };
        }
        groups[collectionId].sumLikes += item.post?.postLikes?.length ?? 0;

        // 게시물에 포함된 이미지 URL 정보를 가져온다
        const images = item.post?.images ?? [];
        const fileUrls = images.map((image: any) => image.file_url);
        groups[collectionId].images = fileUrls;

        return groups;
      }, {});

      // 컬렉션별 좋아요 합산값에 따라 내림차순으로 정렬한다
      const collectionSumLikes: any = Object.values(groupedData);
      collectionSumLikes.sort((a: any, b: any) => b.sumLikes - a.sumLikes);

      // 상위 10개 컬렉션 정보를 구성하여 반환한다
      const top3Collections = collectionSumLikes
        // .slice(0, 10)
        .map(({ collection, user, sumLikes, images }: any) => {
          return {
            id: collection.id,
            name: collection.name,
            user: {
              id: user.id,
              nickname: user.nickname,
            },
            sumLikes,
            images,
          };
        });

      return top3Collections;
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
    ### 23.03.21
    ### 표정훈
    ### [Main] 내 친구의 맛집리스트
    */
  async FollowersMyList(userId: number) {
    try {
      //팔로잉 아이디 찾기
      const followerId = await this.followRepository.find({
        where: {
          follower: { id: userId },
        },
        select: {
          following: { id: true },
        },
        relations: {
          following: true,
        },
      });

      const followingIds = followerId
        .map((f) => f.following.id)
        .filter((id) => !isNaN(id));

      const myListFollwers = await this.collectionItemRepository.find({
        relations: {
          post: {
            user: true,
            images: true,
          },
          collection: {
            user: true,
          },
        },
        where: {
          collection: {
            type: 'myList',
            deletedAt: null,
            user_id: In(followingIds), //팔로워들의 아이디
          },
        },
        select: {
          post: {
            id: true,
            images: { id: true, file_url: true },
            user: {
              id: true,
              nickname: true,
            },
          },
          collection: {
            id: true,
            name: true,
            user: {
              id: true,
              nickname: true,
            },
          },
        },
      });

      //랜덤하게 값 가져오기
      myListFollwers.sort(() => Math.random() - 0.5);

      return myListFollwers;
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
