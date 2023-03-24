import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// import _ from 'lodash';
import { Repository, Between, MoreThan } from 'typeorm';
import { Post } from './entities/post.entity';
import { PostLikeService } from './post-like.service';
import { PostHashtagService } from './post-hashtag.service';
import { MyListService } from '../collection/my-list.service';
import { Comment } from '../comment/entities/comment.entity';
import { RestaurantService } from '../restaurant/restaurant.service';
import { ImageRepository } from './image.repository';
import { UploadService } from '../upload/upload.service';
import { CollectionItem } from '../collection/entities/collection-item.entity';
// import shuffle from 'lodash/shuffle';
import { PostLike } from './entities/post-like.entity';
// import { fromSubQuery} from
// type Image = string | Express.Multer.File;
import { PostUserTag } from './entities/post-usertag.entity';
import { PostUserTagService } from './post-user-tag.service';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
    @InjectRepository(Comment) private commentRepository: Repository<Comment>,
    @InjectRepository(CollectionItem)
    private collectionItemRepository: Repository<CollectionItem>,
    @InjectRepository(PostLike)
    private postLikeRepository: Repository<PostLike>,
    private imageRepository: ImageRepository,
    private readonly likeService: PostLikeService,
    private readonly postHashtagService: PostHashtagService,
    private readonly myListService: MyListService,
    private readonly restaurantService: RestaurantService,
    private readonly uploadService: UploadService,
    private readonly postUserTagService: PostUserTagService,
  ) {}

  /*
                                                                                    ### 23.03.13
                                                                                    ### 이드보라
                                                                                    ### 조건 없이 모든 포스팅 불러오기(뉴스피드 페이지).불러오는 유저 정보 수정
                                                                                    */

  async getPosts(userId: number, page: string) {
    try {
      const pageNum = Number(page) - 1;
      const posts = await this.postRepository.find({
        where: { deleted_at: null, visibility: 'public' },
        select: {
          id: true,
          content: true,
          rating: true,
          updated_at: true,
          created_at: true,
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
          postUserTags: { id: true, user: { nickname: true } },
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
          postUserTags: { user: true },
        },
        order: { created_at: 'desc' },
        skip: pageNum * 8,
        take: 8,
      });
      if (!posts || posts.length === 0) {
        throw new NotFoundException('포스트가 없습니다.');
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
        const userTags = post.postUserTags.map(
          (userTag) => userTag.user.nickname,
        );
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
          userTags,
        };
      });
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw new HttpException(err.message, HttpStatus.NOT_FOUND);
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
                                                                                      ### 이드보라
                                                                                      ### 포스팅 상세보기.좋아요 기능 추가. 불러오는 유저 정보 수정
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
            x: true,
            y: true,
          },
          user: { id: true, nickname: true, profile_image: true },
          images: { id: true, file_url: true },
          collectionItems: { id: true, collection: { id: true } },
          postUserTags: { id: true, user: { nickname: true } },
        },
        relations: {
          user: true,
          restaurant: true,
          hashtags: true,
          images: true,
          collectionItems: {
            collection: true,
          },
          postUserTags: { user: true },
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

      const myList = post[0].collectionItems.map((item) => ({
        id: item.collection.id,
      }));

      const userTags = post[0].postUserTags.map(
        (userTag) => userTag.user.nickname,
      );

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
        myList,
        visibility: post[0].visibility,
        userTags,
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
                                                                                      ### 23.03.11
                                                                                      ### 이드보라
                                                                                      ### 포스팅 작성
                                                                                      */
  async createPost(
    userId: number,
    address_name: string,
    category_group_code: string,
    category_group_name: string,
    category_name: string,
    kakao_place_id: string,
    phone: string,
    place_name: string,
    road_address_name: string,
    x: string,
    y: string,
    myListIds: number[],
    content: string,
    rating: number,
    visibility,
    hashtagNames: string[],
    // userTags: string[],
    files: Express.Multer.File[],
  ) {
    try {
      const createdRestaurant = await this.restaurantService.createRestaurant(
        address_name,
        category_group_code,
        category_group_name,
        category_name,
        kakao_place_id,
        phone,
        place_name,
        road_address_name,
        x,
        y,
      );

      const restaurantId = createdRestaurant;

      const post = await this.postRepository.create({
        user: { id: userId },
        restaurant: { id: restaurantId },
        content,
        rating,
        visibility,
      });

      const hashtags = await this.postHashtagService.createOrUpdateHashtags(
        hashtagNames,
      );

      post.hashtags = hashtags;

      await this.postRepository.save(post);

      const postId = post.id;

      files.map(async (file) => {
        try {
          const uploadedFile = await this.uploadService.uploadPostImageToS3(
            'yumyumdb-post',
            file,
          );
          await this.imageRepository.save({
            file_url: uploadedFile.postImage,
            post: { id: postId },
          });
        } catch (err) {
          console.error(err);
          throw new InternalServerErrorException(
            'Something went wrong while processing your request. Please try again later.',
          );
        }
      });

      await this.myListService.myListPlusPosting(postId, myListIds);

      // await this.postUserTagService.tagUsersInPost(postId, userTags);

      return { postId: postId };
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException(
        'Something went wrong while processing your request. Please try again later.',
      );
    }
  }

  /*
                                                                                      ### 23.03.10
                                                                                      ### 이드보라
                                                                                      ### 포스팅 수정
                                                                                      */
  async updatePost(
    id: number,
    address_name: string,
    category_group_code: string,
    category_group_name: string,
    category_name: string,
    kakao_place_id: string,
    phone: string,
    place_name: string,
    road_address_name: string,
    x: string,
    y: string,
    myListId: number[],
    content: string,
    rating: number,
    visibility,
    hashtagNames: string[],
    // userTags: string[],
    newFiles: Express.Multer.File[],
    originalFiles: string[],
  ) {
    try {
      const post = await this.postRepository.findOne({
        where: { id },
        relations: ['hashtags', 'images'],
      });
      if (!post) {
        throw new NotFoundException(`존재하지 않는 포스트입니다.`);
      }

      let createdRestaurant;

      if (kakao_place_id) {
        createdRestaurant = await this.restaurantService.createRestaurant(
          address_name,
          category_group_code,
          category_group_name,
          category_name,
          kakao_place_id,
          phone,
          place_name,
          road_address_name,
          x,
          y,
        );
      }
      const restaurantId = createdRestaurant;
      const updateData: any = {};
      if (restaurantId) {
        updateData.restaurant = { id: restaurantId };
      }
      if (content) {
        updateData.content = content;
      }
      if (rating) {
        updateData.rating = rating;
      }

      if (visibility) {
        updateData.visibility = visibility;
      }
      if (hashtagNames) {
        const existingHashtags = post.hashtags.map((hashtag) => hashtag.name);
        const newHashtags = (
          await this.postHashtagService.createOrUpdateHashtags(hashtagNames)
        ).map((hashtag) => hashtag.name);

        if (
          existingHashtags.sort().join(',') !== newHashtags.sort().join(',')
        ) {
          const hashtags = await this.postHashtagService.createOrUpdateHashtags(
            hashtagNames,
          );
          updateData.hashtags = hashtags;
        }
      }

      await this.postRepository.save(
        {
          ...post,
          ...updateData,
        },
        { reload: true },
      );

      if (!Array.isArray(originalFiles)) {
        originalFiles = [originalFiles];
      }

      let newPostImages;
      if (newFiles) {
        const uploadedFiles = newFiles.map(async (image) => {
          try {
            return await this.uploadService.uploadPostImageToS3(
              'yumyumdb-post',
              image,
            );
          } catch (err) {
            console.error(err);
            throw new InternalServerErrorException(
              'Something went wrong while processing your request. Please try again later.',
            );
          }
        });
        const results = await Promise.all(uploadedFiles);
        newPostImages = results.map((result) => {
          return result.postImage;
        });
      }

      await this.imageRepository.updatePostImages(
        newPostImages,
        originalFiles,
        post,
      );

      if (myListId) {
        await this.myListService.myListUpdatePosting(id, myListId);
      }

      // if (userTags) {
      //   await this.postUserTagService.updateUserTagInPost(id, userTags);
      // }

      return { postId: id };
    } catch (err) {
      if (err instanceof NotFoundException) {
        console.error(err);
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
                                                                                      ### 23.03.06
                                                                                      ### 이드보라
                                                                                      ### 포스팅 삭제
                                                                                      */
  async deletePost(id: number) {
    try {
      const result = await this.postRepository.softDelete(id);
      if (result.affected === 0) {
        throw new NotFoundException('존재하지 않는 포스트입니다.');
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
                                                                                      ### 장승윤, 이드보라
                                                                                      ### 내 포스트만 불러오기
                                                                                      */

  async getPostsByMyId(userId: number, page: string) {
    try {
      const pageNum = Number(page) - 1;
      const posts = await this.postRepository.find({
        where: { deleted_at: null, visibility: 'public', user: { id: userId } },
        select: {
          id: true,
          content: true,
          rating: true,
          updated_at: true,
          visibility: true,
          created_at: true,
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
          postUserTags: { id: true, user: { nickname: true } },
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
          postUserTags: { user: true },
        },
        order: { created_at: 'desc' },
        skip: pageNum * 8,
        take: 8,
      } as any);
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
        const userTags = post.postUserTags.map(
          (userTag) => userTag.user.nickname,
        );
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
          userTags,
        };
      });
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw new HttpException(err.message, HttpStatus.NOT_FOUND);
      } else {
        console.error(err);
        throw new InternalServerErrorException(
          'Something went wrong while processing your request. Please try again later.',
        );
      }
    }
  }

  async getPostsByOtherUserId(userId: number, myUserId: number, page: string) {
    try {
      const pageNum = Number(page) - 1;
      const posts = await this.postRepository.find({
        where: { deleted_at: null, visibility: 'public', user: { id: userId } },
        select: {
          id: true,
          content: true,
          rating: true,
          updated_at: true,
          visibility: true,
          created_at: true,
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
          postUserTags: { id: true, user: { nickname: true } },
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
          postUserTags: { user: true },
        },
        order: { created_at: 'desc' },
        skip: pageNum * 8,
        take: 8,
      } as any);
      if (!posts || posts.length === 0) {
        return [];
      }
      const postIds = posts.map((post) => post.id);

      const postLikes = await this.likeService.getLikesForAllPosts(postIds);

      const likedStatuses = await this.likeService.getLikedStatusforAllPosts(
        postIds,
        myUserId,
      );

      return posts.map((post) => {
        const hashtags = post.hashtags.map((hashtag) => hashtag.name);
        const likes =
          postLikes.find((like) => like.postId === post.id)?.totalLikes || 0;
        const isLiked =
          likedStatuses.find((status) => status.postId === post.id)?.isLiked ||
          'False';
        const totalComments = post.comments ? post.comments.length : 0;
        const userTags = post.postUserTags.map(
          (userTag) => userTag.user.nickname,
        );
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
          userTags,
        };
      });
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw new HttpException(err.message, HttpStatus.NOT_FOUND);
      } else {
        console.error(err);
        throw new InternalServerErrorException(
          'Something went wrong while processing your request. Please try again later.',
        );
      }
    }
  }

  /*
                                                                                      ### 23.03.23
                                                                                      ### 이드보라
                                                                                      ### 메인페이지 - 회원들의 추천 맛집 리뷰
                                                                                      */

  async getTrendingPosts(category: string): Promise<any> {
    try {
      // const trendingPostsByCategory = [];

      const date = new Date();
      date.setMonth(date.getMonth() - 1);

      const trendingPosts = await this.postRepository
        .createQueryBuilder('post')
        .leftJoin('post.postLikes', 'postLikes')
        .leftJoin('post.restaurant', 'restaurant')
        .leftJoin('post.user', 'user')
        .leftJoin('post.images', 'image')
        .select('post.id')
        .addSelect([
          'post.content',
          'post.rating',
          'post.updated_at',
          'post.created_at',
        ])
        .addSelect('COUNT(postLikes.id) as postLikesCount')
        .groupBy(
          "TRIM(CASE WHEN LOCATE('>', SUBSTRING(restaurant.category_name, LOCATE('>', restaurant.category_name) + 1)) > 0 THEN SUBSTRING(SUBSTRING(restaurant.category_name, LOCATE('>', restaurant.category_name) + 1), 1, LOCATE('>', SUBSTRING(restaurant.category_name, LOCATE('>', restaurant.category_name) + 1)) - 1) ELSE SUBSTRING(restaurant.category_name, LOCATE('>', restaurant.category_name) + 1) END), restaurant.place_name, user.profile_image, user.nickname",
        )
        .orderBy('postLikesCount', 'DESC')
        // .addOrderBy('RAND()')
        .where('post.visibility = :visibility', { visibility: 'public' })
        .where('postLikes.updated_at >= :date', { date })
        .where(
          "TRIM(CASE WHEN LOCATE('>', SUBSTRING(restaurant.category_name, LOCATE('>', restaurant.category_name) + 1)) > 0 THEN SUBSTRING(SUBSTRING(restaurant.category_name, LOCATE('>', restaurant.category_name) + 1), 1, LOCATE('>', SUBSTRING(restaurant.category_name, LOCATE('>', restaurant.category_name) + 1)) - 1) ELSE SUBSTRING(restaurant.category_name, LOCATE('>', restaurant.category_name) + 1) END) = :category",
          { category: category },
        )
        .addSelect(
          "TRIM(CASE WHEN LOCATE('>', SUBSTRING(restaurant.category_name, LOCATE('>', restaurant.category_name) + 1)) > 0 THEN SUBSTRING(SUBSTRING(restaurant.category_name, LOCATE('>', restaurant.category_name) + 1), 1, LOCATE('>', SUBSTRING(restaurant.category_name, LOCATE('>', restaurant.category_name) + 1)) - 1) ELSE SUBSTRING(restaurant.category_name, LOCATE('>', restaurant.category_name) + 1) END)",
          'category',
        )
        .addSelect('restaurant.place_name')
        .addSelect('user.profile_image')
        .addSelect('user.nickname')
        .addSelect('image.file_url')
        .addSelect('postLikes.id')
        .take(5)
        .getMany();

      return trendingPosts;
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException(
        'Something went wrong while processing your request. Please try again later.',
      );
    }
  }

  /*
                                                                                      ### 23.03.22
                                                                                      ### 이드보라
                                                                                      ### 내 주변 피드
                                                                                      */

  async getPostsAroundMe(x: string, y: string, userId, page: string) {
    try {
      const pageNum = Number(page) - 1;
      const postsAroundMe = await this.postRepository
        .createQueryBuilder('post')
        .leftJoin('post.restaurant', 'restaurant')
        .leftJoin('post.images', 'image')
        .leftJoinAndSelect('post.hashtags', 'hashtags')
        .leftJoin('post.user', 'user')
        // .leftJoinAndSelect('post.collectionItems', 'collectionItem')
        // // .leftJoinAndSelect('collectionItem.collection', 'collection')
        // .leftJoinAndSelect('post.postUserTags', 'userTags')
        // .innerJoin('userTags.user', 'taggedUser')
        .select([
          'post.id',
          'post.content',
          'post.rating',
          'post.updated_at',
          'post.visibility',
          'post.created_at',
        ])
        .addSelect([
          'restaurant.kakao_place_id',
          'restaurant.address_name',
          'restaurant.category_name',
          'restaurant.place_name',
          'restaurant.road_address_name',
        ])
        .addSelect(['user.id', 'user.nickname', 'user.profile_image'])
        .addSelect(
          `6371 * acos(cos(radians(${y})) * cos(radians(y)) * cos(radians(x) - radians(${x})) + sin(radians(${y})) * sin(radians(y)))`,
          'distance',
        )
        .addSelect('hashtags.name')
        .addSelect('image.file_url')
        // .addSelect('collectionItem.collection')
        // .addSelect('userTags.user AS taggedUser')
        .having(`distance <= 3`)
        .orderBy('post.created_at', 'DESC')
        .skip(pageNum * 8)
        .take(8)
        .getMany();

      if (!postsAroundMe) {
        throw new NotFoundException('포스트가 없습니다.');
      }

      const postIds = postsAroundMe.map((post) => post.id);

      const postLikes = await this.likeService.getLikesForAllPosts(postIds);

      const likedStatuses = await this.likeService.getLikedStatusforAllPosts(
        postIds,
        userId,
      );

      return postsAroundMe.map((post, index) => {
        const likes =
          postLikes.find((like) => like.postId === post.id)?.totalLikes || 0;
        const isLiked =
          likedStatuses.find((status) => status.postId === post.id)?.isLiked ||
          'False';
        const totalComments = post.comments ? post.comments.length : 0;
        // const myList =
        //   post.collectionItems.map(
        //     (collectionItem) => collectionItem.collection.id,
        //   ) || [];
        // const userTags =
        //   post.postUserTags.map((userTag) => userTag.user.nickname) || [];
        return {
          id: post.id,
          content: post.content,
          rating: post.rating,
          updated_at: post.updated_at,
          user: post.user,
          restaurant: post.restaurant,
          images: post.images,
          hashtags: post.hashtags,
          totalLikes: likes,
          isLiked,
          totalComments,
          // myList,
          visibility: post.visibility,
          // userTags,
        };
      });
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw new HttpException(err.message, HttpStatus.NOT_FOUND);
      } else {
        console.error(err);
        throw new InternalServerErrorException(
          'Something went wrong while processing your request. Please try again later.',
        );
      }
    }
  }
}
