import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import _ from 'lodash';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { PostLikeService } from './post-like.service';
import { PostHashtagService } from './post-hashtag.service';
import { MyListService } from '../collection/my-list.service';
import { Comment } from '../comment/entities/comment.entity';
import { RestaurantService } from '../restaurant/restaurant.service';
import { ImageRepository } from './image.repository';
import { UploadService } from '../upload/upload.service';
// import { PostUserTag } from './entities/post-usertag.entity';
// import { PostUserTagService } from './post-user-tag.service';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
    @InjectRepository(Comment) private commentRepository: Repository<Comment>,
    private imageRepository: ImageRepository,
    private readonly likeService: PostLikeService,
    private readonly postHashtagService: PostHashtagService,
    private readonly myListService: MyListService,
    private readonly restaurantService: RestaurantService,
    private readonly uploadService: UploadService, // private readonly postUserTagService: PostUserTagService,
  ) {}

  /*
                                                                                    ### 23.03.13
                                                                                    ### 이드보라
                                                                                    ### 조건 없이 모든 포스팅 불러오기(뉴스피드 페이지).불러오는 유저 정보 수정
                                                                                    */

  async getPosts(userId: number) {
    try {
      const posts = await this.postRepository.find({
        where: { deleted_at: null, visibility: 'public' },
        select: {
          id: true,
          content: true,
          rating: true,
          updated_at: true,
          restaurant: {
            id: true,
            address_name: true,
            category_name: true,
            place_name: true,
            road_address_name: true,
          },
          user: { id: true, nickname: true, profile_image: true },
          images: { id: true, file_url: true },
        },
        relations: ['user', 'restaurant', 'hashtags', 'comments', 'images'],
        order: { created_at: 'desc' },
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
          restaurant: {
            id: true,
            address_name: true,
            category_name: true,
            place_name: true,
            road_address_name: true,
          },
          user: { id: true, nickname: true, profile_image: true },
          images: { id: true, file_url: true },
        },
        relations: ['restaurant', 'user', 'hashtags', 'images'],
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
    files: Express.Multer.File[],
    // usernames: string[],
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

      // for (const imageUrl of img) {
      //   const image = await this.imageRepository.create({
      //     post: { id: postId },
      //     file_url: imageUrl,
      //   });
      //   await this.imageRepository.save(image);
      // }
      files.map((file) => {
        this.uploadService.uploadPostImageToS3('yumyumdb-post', file);
      });

      await this.myListService.myListPlusPosting(postId, myListIds);

      return { postId: postId };

      // if (usernames && usernames.length > 0) {
      //   await this.postUserTagService.tagUsersInPost(savedPost.id, usernames);
      // }
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
    files: Express.Multer.File[],
  ) {
    try {
      const post = await this.postRepository.findOne({
        where: { id },
        relations: ['hashtags', 'images'],
      });
      if (!post) {
        throw new NotFoundException(`존재하지 않는 포스트입니다.`);
      }

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

      // await this.imageRepository.updatePostImages(post, images);
      files.map((file) => {
        this.uploadService.uploadPostImageToS3('yumyumdb-post', file);
      });

      if (myListId) {
        await this.myListService.myListPlusPosting(id, myListId);
      }

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

  async getPostsByUserId(userId: number) {
    try {
      const posts = await this.postRepository.find({
        where: { deleted_at: null, visibility: 'public', user: { id: userId } },
        select: {
          id: true,
          content: true,
          rating: true,
          updated_at: true,
          restaurant: {
            id: true,
            address_name: true,
            category_name: true,
            place_name: true,
            road_address_name: true,
          },
          user: { id: true, nickname: true, profile_image: true },
          images: { id: true, file_url: true },
        },
        relations: ['user', 'restaurant', 'hashtags', 'images'],
        order: { created_at: 'desc' },
      });
      if (!posts || posts.length === 0) {
        throw new NotFoundException('작성하신 포스트가 없습니다.');
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
