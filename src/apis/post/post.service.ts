import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// import _ from 'lodash';
import { Repository, Between, MoreThan, Not } from 'typeorm';
// import { Post } from './entities/post.entity';
import { PostLikeService } from './post-like.service';
import { MyListService } from '../collection/my-list.service';
import { Comment } from '../comment/entities/comment.entity';
import { RestaurantService } from '../restaurant/restaurant.service';
import { ImageRepository } from './image.repository';
import { UploadService } from '../upload/upload.service';
// import shuffle from 'lodash/shuffle';
// import { PostLike } from './entities/post-like.entity';
// import { fromSubQuery} from
// type Image = string | Express.Multer.File;
// import { PostUserTag } from './entities/post-usertag.entity';
import { PostUserTagService } from './post-user-tag.service';
import { BookmarkService } from '../collection/bookmark.service';
import { Hashtag } from './entities/hashtag.entity';
import { PostRepository } from './post.repository';
import { UpdatePostInput } from './post.repository';
import { HashtagRepository } from './post-hashtag.repository';

@Injectable()
export class PostService {
  constructor(
    private postRepository: PostRepository,
    @InjectRepository(Comment) private commentRepository: Repository<Comment>,
    private hashtagRepository: HashtagRepository,
    private imageRepository: ImageRepository,
    private readonly likeService: PostLikeService,
    private readonly myListService: MyListService,
    private readonly restaurantService: RestaurantService,
    private readonly uploadService: UploadService,
    private readonly postUserTagService: PostUserTagService,
    private readonly bookmarkService: BookmarkService,
  ) {}

  /*
                                                                                    ### 23.03.13
                                                                                    ### 이드보라
                                                                                    ### 조건 없이 모든 포스팅 불러오기(뉴스피드 페이지).불러오는 유저 정보 수정
                                                                                    */

  async getPosts(userId: number, page: string) {
    try {
      const posts = await this.postRepository.getAllPosts(page);

      if (!posts || posts.length === 0) {
        throw new NotFoundException('포스트가 없습니다.');
      }

      const postIds = posts.map((post) => post.id);

      const postLikes = await this.likeService.getLikesForAllPosts(postIds);

      const likedStatuses = await this.likeService.getLikedStatusForAllPosts(
        postIds,
        userId,
      );

      const bookmarkedStatuses =
        await this.bookmarkService.isAllPostsBookmarkedByUser(userId, postIds);

      return posts.map((post) => {
        const hashtags = post.hashtags.map((hashtag) => hashtag.name);
        const likes =
          postLikes.find((like) => like.postId === post.id)?.totalLikes || 0;
        const isLiked =
          likedStatuses.find((status) => status.postId === post.id)?.isLiked ||
          'False';
        const totalComments = post.comments ? post.comments.length : 0;
        // const userTags = post.postUserTags.map(
        //   (userTag) => userTag.user.nickname,
        // );
        const sortedImages = post.images.sort((a, b) => {
          if (a.created_at > b.created_at) {
            return 1;
          } else if (a.created_at < b.created_at) {
            return -1;
          }
          return 0;
        });
        const myListItems = post.collectionItems.filter(
          (item) => item.collection && item.collection.type === 'myList',
        );
        const myListId = myListItems.map((item) => item.collection.id);
        const isBookmarked =
          bookmarkedStatuses.find((status) => status.postId === post.id)
            ?.isBookmarked || 'False';
        return {
          id: post.id,
          content: post.content,
          rating: post.rating,
          updated_at: post.updated_at,
          user: post.user,
          restaurant: post.restaurant,
          images: sortedImages,
          hashtags,
          totalLikes: likes,
          isLiked,
          totalComments,
          myList: myListId,
          visibility: post.visibility,
          // userTags,
          isBookmarked,
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
      const post = await this.postRepository.getPostById(postId, userId);

      if (!post || post.length === 0) {
        throw new NotFoundException(`존재하지 않는 포스트입니다.`);
      }

      const totalLikes = await this.likeService.getLikesForPost(postId);

      const hashtags = post[0].hashtags.map(({ name }) => ({ name }));

      const { isLiked } = await this.likeService.getLikedStatusForOnePost(
        postId,
        userId,
      );

      const totalComments = await this.commentRepository.count({
        where: { deleted_at: null, post: { id: postId } },
      });

      const myListItems = post[0].collectionItems.filter(
        (item) => item.collection && item.collection.type === 'myList',
      );
      const myListId = myListItems.map((item) => item.collection.id);

      const { isBookmarked } =
        await this.bookmarkService.isOnePostBookmarkedByUser(userId, postId);

      // const userTags = post[0].postUserTags.map(
      //   (userTag) => userTag.user.nickname,
      // );

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
        myListId,
        visibility: post[0].visibility,
        isBookmarked,
        // userTags,
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

      const post = await this.postRepository.createPost(
        userId,
        restaurantId,
        content,
        rating,
        visibility,
      );

      const hashtags = await this.createOrUpdateHashtags(hashtagNames);

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
      const post = await this.postRepository.getOneSimplePost(id);

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
          await this.createOrUpdateHashtags(hashtagNames)
        ).map((hashtag) => hashtag.name);

        if (
          existingHashtags.sort().join(',') !== newHashtags.sort().join(',')
        ) {
          const hashtags = await this.createOrUpdateHashtags(hashtagNames);
          updateData.hashtags = hashtags;
        }
      }

      const updatePostInput = {
        postId: id,
        updateData,
      } as UpdatePostInput;

      await this.postRepository.updatePost(updatePostInput);

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
      const result = await this.postRepository.deletePost(id);
      if (result === 0) {
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
      const posts = await this.postRepository.getPostsByMyId(userId, page);
      if (!posts || posts.length === 0) {
        return [];
      }
      const postIds = posts.map((post) => post.id);

      const postLikes = await this.likeService.getLikesForAllPosts(postIds);

      const likedStatuses = await this.likeService.getLikedStatusForAllPosts(
        postIds,
        userId,
      );

      const bookmarkedStatuses =
        await this.bookmarkService.isAllPostsBookmarkedByUser(userId, postIds);

      return posts.map((post) => {
        const hashtags = post.hashtags.map((hashtag) => hashtag.name);
        const likes =
          postLikes.find((like) => like.postId === post.id)?.totalLikes || 0;
        const isLiked =
          likedStatuses.find((status) => status.postId === post.id)?.isLiked ||
          'False';
        const totalComments = post.comments ? post.comments.length : 0;
        // const userTags = post.postUserTags.map(
        //   (userTag) => userTag.user.nickname,
        // );
        const sortedImages = post.images.sort((a, b) => {
          if (a.created_at > b.created_at) {
            return 1;
          } else if (a.created_at < b.created_at) {
            return -1;
          }
          return 0;
        });
        const myListItems = post.collectionItems.filter(
          (item) => item.collection && item.collection.type === 'myList',
        );
        const myListId = myListItems.map((item) => item.collection.id);
        const isBookmarked =
          bookmarkedStatuses.find((status) => status.postId === post.id)
            ?.isBookmarked || 'False';
        return {
          id: post.id,
          content: post.content,
          rating: post.rating,
          updated_at: post.updated_at,
          user: post.user,
          restaurant: post.restaurant,
          images: sortedImages,
          hashtags,
          totalLikes: likes,
          isLiked,
          totalComments,
          myList: myListId,
          visibility: post.visibility,
          isBookmarked,
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

  async getPostsByUserId(userId: number, myUserId: number, page: string) {
    try {
      const pageNum = Number(page) - 1;
      let posts;
      if (userId === myUserId) {
        posts = await this.postRepository.getPostsByMyId(userId, page);
      } else {
        posts = await this.postRepository.getPostsByOtherUserId(userId, page);
      }
      if (!posts || posts.length === 0) {
        return [];
      }
      const postIds = posts.map((post) => post.id);

      const postLikes = await this.likeService.getLikesForAllPosts(postIds);

      const likedStatuses = await this.likeService.getLikedStatusForAllPosts(
        postIds,
        myUserId,
      );

      const bookmarkedStatuses =
        await this.bookmarkService.isAllPostsBookmarkedByUser(
          myUserId,
          postIds,
        );

      return posts.map((post) => {
        const hashtags = post.hashtags.map((hashtag) => hashtag.name);
        const likes =
          postLikes.find((like) => like.postId === post.id)?.totalLikes || 0;
        const isLiked =
          likedStatuses.find((status) => status.postId === post.id)?.isLiked ||
          'False';
        const totalComments = post.comments ? post.comments.length : 0;
        // const userTags = post.postUserTags.map(
        //   (userTag) => userTag.user.nickname,
        // );
        const sortedImages = post.images.sort((a, b) => {
          if (a.created_at > b.created_at) {
            return 1;
          } else if (a.created_at < b.created_at) {
            return -1;
          }
          return 0;
        });
        const myListItems = post.collectionItems.filter(
          (item) => item.collection && item.collection.type === 'myList',
        );
        const myListId = myListItems.map((item) => item.collection.id);
        const isBookmarked =
          bookmarkedStatuses.find((status) => status.postId === post.id)
            ?.isBookmarked || 'False';
        return {
          id: post.id,
          content: post.content,
          rating: post.rating,
          updated_at: post.updated_at,
          user: post.user,
          restaurant: post.restaurant,
          images: sortedImages,
          hashtags,
          totalLikes: likes,
          isLiked,
          totalComments,
          myList: myListId,
          visibility: post.visibility,
          isBookmarked,
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

  /*
                                                                                      ### 23.03.23
                                                                                      ### 이드보라
                                                                                      ### 메인페이지 - 회원들의 추천 맛집 리뷰
                                                                                      */

  async getTrendingPosts(category: string): Promise<any> {
    try {
      return await this.postRepository.getTrendingPosts(category);
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
      const postsAroundMe = await this.postRepository.getPostsAroundMe(
        x,
        y,
        userId,
        page,
      );

      if (!postsAroundMe) {
        throw new NotFoundException('포스트가 없습니다.');
      }

      const postIds = postsAroundMe.map((post) => post.id);

      const postLikes = await this.likeService.getLikesForAllPosts(postIds);

      const likedStatuses = await this.likeService.getLikedStatusForAllPosts(
        postIds,
        userId,
      );

      const bookmarkedStatuses =
        await this.bookmarkService.isAllPostsBookmarkedByUser(userId, postIds);

      // const myList = postsAroundMe.raw.map((rawPost) => {
      //   return rawPost.collection_id;
      // });

      return postsAroundMe.map((post, index) => {
        const hashtags = post.hashtags.map((hashtag) => hashtag.name);
        const likes =
          postLikes.find((like) => like.postId === post.id)?.totalLikes || 0;
        const isLiked =
          likedStatuses.find((status) => status.postId === post.id)?.isLiked ||
          'False';
        const totalComments = post.comments ? post.comments.length : 0;
        const sortedImages = post.images.sort((a, b) => {
          if (a.created_at > b.created_at) {
            return 1;
          } else if (a.created_at < b.created_at) {
            return -1;
          }
          return 0;
        });
        const isBookmarked =
          bookmarkedStatuses.find((status) => status.postId === post.id)
            ?.isBookmarked || 'False';
        // const userTags =
        //   post.postUserTags.map((userTag) => userTag.user.nickname) || [];
        return {
          id: post.id,
          content: post.content,
          rating: post.rating,
          updated_at: post.updated_at,
          user: post.user,
          restaurant: post.restaurant,
          images: sortedImages,
          hashtags,
          totalLikes: likes,
          isLiked,
          totalComments,
          // myList,
          visibility: post.visibility,
          isBookmarked,
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

  async createOrUpdateHashtags(hashtagNames: string[]): Promise<Hashtag[]> {
    try {
      return Promise.all(
        hashtagNames.map(async (name) => {
          let hashtag = await this.hashtagRepository.findHashtag(name);
          if (!hashtag) {
            hashtag = new Hashtag();
            hashtag.name = name;
            await this.hashtagRepository.saveHashtag(hashtag);
          }
          return hashtag;
        }),
      );
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException(
        'Something went wrong while processing your request. Please try again later.',
      );
    }
  }
}
