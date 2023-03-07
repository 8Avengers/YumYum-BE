import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { PostService } from './post.service';
import { Test } from '@nestjs/testing';
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

      const result = await postService.getPosts();

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

      await expect(postService.getPosts()).rejects.toThrowError(
        new NotFoundException('No posts found.'),
      );
    });

    it('should throw an InternalServerErrorException if an error occurs', async () => {
      mockPostRepository.createQueryBuilder = jest
        .fn()
        .mockImplementationOnce(() => {
          throw new Error('Something went wrong');
        });

      await expect(postService.getPosts()).rejects.toThrowError(
        new InternalServerErrorException(
          'Something went wrong while processing your request. Please try again later.',
        ),
      );
    });
  });

  describe('getPostById', () => {
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

      const result = await postService.getPostById(id);

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

      await expect(postService.getPostById(id)).rejects.toThrow(
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

      await expect(postService.getPostById(id)).rejects.toThrow(
        new InternalServerErrorException(
          'Something went wrong while processing your request. Please try again later.',
        ),
      );
    });
  });

  describe('createPost', () => {
    const newPost = {
      content: 'content1',
      rating: 5,
      img_url: 'img_url',
      visibility: 'public',
    };
    it('should create a new post', async () => {
      const expectedPost = {
        content: newPost.content,
        rating: newPost.rating,
        img_url: newPost.img_url,
        visibility: newPost.visibility,
      };

      mockPostRepository.insert = jest.fn().mockResolvedValueOnce(expectedPost);

      const createdPost = await postService.createPost(
        newPost.content,
        newPost.rating,
        newPost.img_url,
        newPost.visibility,
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
