import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../entities/post.entity';
import { PostService } from '../post.service';
import { Test, mocked } from '@nestjs/testing';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

describe('PostService', () => {
  let postService: PostService;
  let mockPostRepository: Repository<Post>;

  beforeEach(async () => {
    // const mockRepository = {
    //   createQueryBuilder: jest.fn(() => ({
    //     leftJoinAndSelect: jest.fn().mockReturnThis(),
    //     where: jest.fn().mockReturnThis(),
    //     andWhere: jest.fn().mockReturnThis(),
    //     select: jest.fn().mockReturnThis(),
    //     getMany: jest.fn().mockResolvedValueOnce(mockPosts),
    //   })),
    // };

    const moduleRef = await Test.createTestingModule({
      providers: [
        PostService,
        {
          provide: getRepositoryToken(Post),
          useValue: {
            createQueryBuilder: jest.fn(() => ({
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              select: jest.fn().mockReturnThis(),
              getMany: jest.fn(),
            })),
          },
        },
      ],
    }).compile();

    postService = moduleRef.get<PostService>(PostService);
    mockPostRepository = moduleRef.get<Repository<Post>>(
      getRepositoryToken(Post),
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('getPosts', () => {
    const mockUserId = 1;
    const mockPage = '1';
    it('should return an array of posts', async () => {
      const mockPosts = [
        {
          id: 1,
          content: 'First post',
          rating: 5,
          img_url: 'https://example.com/image1.png',
          restaurant: { id: 1, name: 'Restaurant 1' },
          user: { id: 1, nickname: 'User 1' },
          updated_at: new Date(),
        },
        {
          id: 2,
          content: 'Second post',
          rating: 4,
          img_url: 'https://example.com/image2.png',
          restaurant: { id: 2, name: 'Restaurant 2' },
          user: { id: 2, nickname: 'User 2' },
          updated_at: new Date(),
        },
      ];

      mockPostRepository.createQueryBuilder = jest.fn().mockReturnValueOnce({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValueOnce(mockPosts),
      } as any);

      const result = await postService.getPosts(mockUserId, mockPage);

      expect(result).toEqual(mockPosts);
      expect(mockPostRepository.createQueryBuilder).toHaveBeenCalledTimes(1);
    });

    it('should throw a NotFoundException if no posts are found', async () => {
      mockPostRepository.createQueryBuilder = jest.fn().mockReturnValueOnce({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValueOnce([]),
      } as any);

      await expect(
        postService.getPosts(mockUserId, mockPage),
      ).rejects.toThrowError(new NotFoundException('No posts found.'));
    });

    it('should throw an InternalServerErrorException if an error occurs', async () => {
      mockPostRepository.createQueryBuilder = jest
        .fn()
        .mockImplementationOnce(() => {
          throw new Error('Something went wrong');
        });

      await expect(
        postService.getPosts(mockUserId, mockPage),
      ).rejects.toThrowError(
        new InternalServerErrorException(
          'Something went wrong while processing your request. Please try again later.',
        ),
      );
    });
  });

  describe('getPostById', () => {
    const mockUserId = 1;
    it('should return a post by given id', async () => {
      const id = 1;
      const post = new Post();
      post.id = id;
      mockPostRepository.createQueryBuilder = jest.fn().mockReturnValueOnce({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValueOnce(post),
      } as any);

      const result = await postService.getPostById(id, mockUserId);

      expect(result).toBe(post);
    });

    it('should throw a NotFoundException if post is not found', async () => {
      const id = 1;
      mockPostRepository.createQueryBuilder = jest.fn().mockReturnValueOnce({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValueOnce(undefined),
      } as any);

      await expect(postService.getPostById(id, mockUserId)).rejects.toThrow(
        new NotFoundException(`Post with id ${id} not found.`),
      );
    });

    it('should throw an InternalServerErrorException if an error occurs', async () => {
      const id = 1;
      mockPostRepository.createQueryBuilder = jest
        .fn()
        .mockImplementationOnce(() => {
          throw new Error();
        });

      await expect(postService.getPostById(id, mockUserId)).rejects.toThrow(
        new InternalServerErrorException(
          'Something went wrong while processing your request. Please try again later.',
        ),
      );
    });
  });

  describe('createPost', () => {
   const files: Express.Multer.File[] = [
  {
    fieldname: 'file',
    originalname: 'test.txt',
    encoding: '7bit',
    mimetype: 'text/plain',
    size: 1024,
    destination: './uploads',
    filename: 'test.txt',
    path: './uploads/test.txt',
    buffer: Buffer.from('test'),
  },
];
    const newPost = {
      userId: 1,
      content: 'content1',
      rating: 5,
      // img_url: 'img_url',
      visibility: 'public',
      address_name: '구의동',
      category_group_code: 'FFF',
      category_group_name: '음식점',
      category_name: '한식',
      kakao_place_id: '12322424',
      phone: '123214215',
      place_name: '식당이름',
      road_address_name: '자양로',
      x: '332423523',
      y: '23252533',
      myListIds: [14, 25],
      hashtagNames: ['dkddkfd'],
      files: File[],
    };
    it('should create a new post', async () => {
      const expectedPost = {
        userId: newPost.userId,
        content: newPost.content,
        rating: newPost.rating,
        // img_url: newPost.img_url,
        visibility: newPost.visibility,
        address_name: newPost.address_name,
        category_group_code: newPost.category_group_code,
        category_group_name: newPost.category_group_name,
        category_name: newPost.category_name,
        kakao_place_id: newPost.kakao_place_id,
        phone: newPost.phone,
        place_name: newPost.place_name,
        road_address_name: newPost.road_address_name,
        x: newPost.x,
        y: newPost.y,
        myListIds: newPost.myListIds,
        hashtagNames: newPost.hashtagNames,
        files: newPost.files,
      };

      mockPostRepository.insert = jest.fn().mockResolvedValueOnce(expectedPost);

      const createdPost = await postService.createPost(
        newPost.userId,
        newPost.address_name,
        newPost.category_group_code,
        newPost.category_group_name,
        newPost.category_name,
        newPost.kakao_place_id,
        newPost.phone,
        newPost.place_name,
        newPost.road_address_name,
        newPost.x,
        newPost.y,
        newPost.myListIds,
        newPost.content,
        newPost.rating,
        // newPost.img_url,
        newPost.visibility,
        newPost.hashtagNames,
        newPost.files,
      );

      expect(createdPost).toEqual(expectedPost);
    });

    it('should throw an error if post could not be created', async () => {
      mockPostRepository.insert = jest
        .fn()
        .mockRejectedValueOnce(
          new InternalServerErrorException('Database connection error'),
        );

      await expect(
        postService.createPost(
          newPost.content,
          newPost.rating,
          newPost.img_url,
          newPost.visibility,
        ),
      ).rejects.toThrow(InternalServerErrorException);

      expect(mockPostRepository.insert).toHaveBeenCalledWith({
        content: newPost.content,
        rating: newPost.rating,
        img_url: newPost.img_url,
        visibility: newPost.visibility,
      });
    });
  });

  describe('updatePost', () => {
    const postId = 5;
    const updatePost = {
      content: 'This post has been updated',
      rating: 4,
      img: 'updated-image-url',
      visibility: 'private',
    };
    it('should update an existing post', async () => {
      mockPostRepository.update = jest.fn().mockResolvedValueOnce({
        ...updatePost,
        postId,
      });

      await postService.updatePost(
        postId,
        updatePost.content,
        updatePost.rating,
        updatePost.img,
        updatePost.visibility,
      );

      expect(mockPostRepository.update).toHaveBeenCalledWith(postId, {
        content: updatePost.content,
        rating: updatePost.rating,
        img_url: updatePost.img,
        visibility: updatePost.visibility,
      });
    });

    it('should throw a NotFoundException when updating a non-existing post', async () => {
      mockPostRepository.update = jest
        .fn()
        .mockResolvedValueOnce({ affected: 0 });

      await expect(
        postService.updatePost(
          postId,
          updatePost.content,
          updatePost.rating,
          updatePost.img,
          updatePost.visibility,
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw an error if post could not be updated', async () => {
      mockPostRepository.update = jest
        .fn()
        .mockRejectedValueOnce(
          new InternalServerErrorException('Database connection error'),
        );

      await expect(
        postService.updatePost(
          postId,
          updatePost.content,
          updatePost.rating,
          updatePost.img,
          updatePost.visibility,
        ),
      ).rejects.toThrow(InternalServerErrorException);

      expect(mockPostRepository.update).toHaveBeenCalledWith(postId, {
        content: updatePost.content,
        rating: updatePost.rating,
        img_url: updatePost.img,
        visibility: updatePost.visibility,
      });
    });
  });

  describe('deletePost', () => {
    const mockPostId = 1;
    const mockPost = {
      content: 'This is a test post',
      rating: 5,
      img: 'img_url',
      visibility: 'public',
    };

    beforeEach(async () => {
      jest.clearAllMocks();
    });

    it('should delete a post by id', async () => {
      mockPostRepository.softDelete = jest.fn().mockResolvedValueOnce(mockPost);

      const result = await postService.deletePost(mockPostId);
      expect(result).toBeUndefined();
      expect(mockPostRepository.softDelete).toHaveBeenCalledWith(mockPostId);
    });

    it('should throw a NotFoundException if post does not exist', async () => {
      mockPostRepository.softDelete = jest.fn().mockResolvedValueOnce({
        affected: 0,
      });

      await expect(postService.deletePost(mockPostId)).rejects.toThrowError(
        new NotFoundException(`Post with id ${mockPostId} not found.`),
      );
      expect(mockPostRepository.softDelete).toHaveBeenCalledWith(mockPostId);
    });

    it('should throw an InternalServerErrorException if delete operation fails', async () => {
      mockPostRepository.softDelete = jest
        .fn()
        .mockRejectedValueOnce(new Error());

      await expect(postService.deletePost(mockPostId)).rejects.toThrowError(
        new InternalServerErrorException(
          'Something went wrong while processing your request. Please try again later.',
        ),
      );
      expect(mockPostRepository.softDelete).toHaveBeenCalledWith(mockPostId);
    });
  });
});
