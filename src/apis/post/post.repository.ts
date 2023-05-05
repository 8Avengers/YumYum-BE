import { DataSource, Not, Repository } from 'typeorm';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Hashtag } from './entities/hashtag.entity';
import { Image } from './entities/image.entity';

export interface UpdatePostInput {
  postId: number;
  updateData: Partial<Post>;
}

@Injectable()
export class PostRepository extends Repository<Post> {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Hashtag) private hashtagRepository: Repository<Hashtag>,
    @InjectRepository(Image) private imageRepository: Repository<Image>,
  ) {
    super(Post, dataSource.createEntityManager());
  }

  async getAllPosts(page: string): Promise<Post[]> {
    try {
      const pageNum = Number(page) - 1;
      return await this.find({
        where: {
          deleted_at: null,
          visibility: 'public',
        },
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
          images: { id: true, file_url: true, created_at: true },
          collectionItems: { id: true, collection: { id: true, type: true } },
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
          // postUserTags: { user: true },
        },
        order: { created_at: 'desc' },
        skip: pageNum * 8,
        take: 8,
      });
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException(
        'Something went wrong while processing your request. Please try again later.',
      );
    }
  }

  async getPostById(postId: number, userId: number): Promise<Post[]> {
    try {
      return await this.find({
        where: [
          {
            id: postId,
            user: { id: userId },
          },
          { id: postId, user: { id: Not(userId) }, visibility: 'public' },
        ],
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
          images: { id: true, file_url: true, created_at: true },
          collectionItems: { id: true, collection: { id: true, type: true } },
          // postUserTags: { id: true, user: { nickname: true } },
        },
        relations: {
          user: true,
          restaurant: true,
          hashtags: true,
          images: true,
          collectionItems: {
            collection: true,
          },
          // postUserTags: { user: true },
        },
        order: { images: { created_at: 'asc' } },
      });
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException(
        'Something went wrong while processing your request. Please try again later.',
      );
    }
  }

  async getPostsByMyId(userId: number, page: string): Promise<Post[]> {
    try {
      const pageNum = Number(page) - 1;
      return await this.find({
        where: {
          user: { id: userId },
        },
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
          images: { id: true, file_url: true, created_at: true },
          collectionItems: { id: true, collection: { id: true, type: true } },
          // postUserTags: { id: true, user: { nickname: true } },
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
          // postUserTags: { user: true },
        },
        order: { created_at: 'desc' },
        skip: pageNum * 8,
        take: 8,
      });
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException(
        'Something went wrong while processing your request. Please try again later.',
      );
    }
  }

  async getPostsByOtherUserId(userId: number, page: string): Promise<Post[]> {
    try {
      const pageNum = Number(page) - 1;
      return await this.find({
        where: {
          visibility: 'public',
          user: { id: userId },
        },
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
          images: { id: true, file_url: true, created_at: true },
          collectionItems: { id: true, collection: { id: true, type: true } },
          // postUserTags: { id: true, user: { nickname: true } },
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
          // postUserTags: { user: true },
        },
        order: { created_at: 'desc' },
        skip: pageNum * 8,
        take: 8,
      });
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException(
        'Something went wrong while processing your request. Please try again later.',
      );
    }
  }

  async getOneSimplePost(postId: number) {
    try {
      return await this.findOne({
        where: { id: postId },
      });
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException(
        'Something went wrong while processing your request. Please try again later.',
      );
    }
  }

  async getTrendingPosts(category: string): Promise<Post[]> {
    try {
      const date = new Date();
      date.setMonth(date.getMonth() - 1);

      return await this.createQueryBuilder('post')
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
          'post.visibility',
        ])
        .addSelect('COUNT(postLikes.id) as postLikesCount')
        .groupBy(
          "TRIM(CASE WHEN LOCATE('>', SUBSTRING(restaurant.category_name, LOCATE('>', restaurant.category_name) + 1)) > 0 THEN SUBSTRING(SUBSTRING(restaurant.category_name, LOCATE('>', restaurant.category_name) + 1), 1, LOCATE('>', SUBSTRING(restaurant.category_name, LOCATE('>', restaurant.category_name) + 1)) - 1) ELSE SUBSTRING(restaurant.category_name, LOCATE('>', restaurant.category_name) + 1) END), restaurant.place_name, user.profile_image, user.nickname",
        )
        .having('post.visibility = :visibility', { visibility: 'public' })
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
        .addSelect(['image.id', 'image.file_url', 'image.created_at'])
        .addSelect('postLikes.id')
        .orderBy('postLikesCount', 'DESC')
        // .addOrderBy('image.created_at', 'ASC')
        .take(5)
        .getMany();
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException(
        'Something went wrong while processing your request. Please try again later.',
      );
    }
  }

  async getPostsAroundMe(
    x: string,
    y: string,
    userId,
    page: string,
  ): Promise<Post[]> {
    try {
      const pageNum = Number(page) - 1;
      return await this.createQueryBuilder('post')
        .leftJoin('post.restaurant', 'restaurant')
        .leftJoin('post.images', 'image')
        .leftJoinAndSelect('post.hashtags', 'hashtags')
        .leftJoin('post.user', 'user')
        .leftJoinAndSelect('post.collectionItems', 'collectionItem')
        .leftJoinAndSelect('collectionItem.collection', 'collection')
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
        .addSelect(['hashtags.id', 'hashtags.name'])
        .addSelect(['image.id', 'image.file_url', 'image.created_at'])
        // .addSelect('collection.id', 'collection_id')
        // .addSelect('userTags.user AS taggedUser')
        .where('post.visibility = :visibility', { visibility: 'public' })
        .having(`distance <= 3`)
        .orderBy('post.created_at', 'DESC')
        .skip(pageNum * 8)
        .take(8)
        .getMany();
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException(
        'Something went wrong while processing your request. Please try again later.',
      );
    }
  }

  async createPost(
    userId: number,
    restaurantId: number,
    content: string,
    rating: number,
    visibility,
  ) {
    try {
      return await this.create({
        user: { id: userId },
        restaurant: { id: restaurantId },
        content,
        rating,
        visibility,
      });
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException(
        'Something went wrong while processing your request. Please try again later.',
      );
    }
  }

  async updatePost({ postId, updateData }: UpdatePostInput): Promise<void> {
    try {
      const post = await this.getOneSimplePost(postId);
      await this.save({ ...post, ...updateData });
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException(
        'Something went wrong while processing your request. Please try again later.',
      );
    }
  }

  async deletePost(postId: number): Promise<number> {
    try {
      const result = await this.softDelete(postId);
      return result.affected || 0;
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException(
        'Something went wrong while processing your request. Please try again later.',
      );
    }
  }
}
