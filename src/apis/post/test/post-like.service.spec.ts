import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../entities/post.entity';
import { PostLike } from '../entities/post-like.entity';
import { PostLikeService } from '../post-like.service';
import {
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import mock = jest.mock;

describe('PostLikeService', () => {
  let postLikeService: PostLikeService;
  let mockPostLikeRepository: Repository<PostLike>;
  let mockPostRepository: Repository<Post>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostLikeService,
        {
          provide: getRepositoryToken(PostLike),
          useValue: {
            createQueryBuilder: jest.fn(() => ({
              addSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              select: jest.fn().mockReturnThis(),
              getRawOne: jest.fn(),
              getRawMany: jest.fn(),
              groupBy: jest.fn(),
            })),
          },
        },
        {
          provide: getRepositoryToken(Post),
          useClass: Repository,
        },
      ],
    }).compile();

    postLikeService = module.get<PostLikeService>(PostLikeService);
    mockPostLikeRepository = module.get<Repository<PostLike>>(
      getRepositoryToken(PostLike),
    );
    mockPostRepository = module.get<Repository<Post>>(getRepositoryToken(Post));
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('getLikesForPost', () => {
    const mockPostId = 1;
    it('should return the total number of likes for a given post', async () => {
      const expectedLikes = 10;

      mockPostLikeRepository.createQueryBuilder = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getRawOne: jest.fn().mockResolvedValue({ likes: expectedLikes }),
      });

      const result = await postLikeService.getLikesForPost(mockPostId);

      expect(mockPostLikeRepository.createQueryBuilder).toHaveBeenCalled();
      expect(result).toEqual(expectedLikes);
    });

    it('should throw an InternalServerErrorException if an error occurs', async () => {
      const errorMessage = 'Something went wrong';

      mockPostLikeRepository.createQueryBuilder = jest
        .fn()
        .mockImplementation(() => {
          throw new Error(errorMessage);
        });

      await expect(
        postLikeService.getLikesForPost(mockPostId),
      ).rejects.toThrowError(
        new InternalServerErrorException(
          'Something went wrong while processing your request. Please try again later.',
        ),
      );
    });
  });

  describe('getLikesForAllPosts', () => {
    const mockPostIds = [1, 2, 3];
    const expectedLikes = [
      { postId: 1, totalLikes: 10 },
      { postId: 2, totalLikes: 20 },
      { postId: 3, totalLikes: 30 },
    ];
    it('should return an array of objects containing the post ID and the total number of likes for each post', async () => {
      mockPostLikeRepository.createQueryBuilder = jest
        .fn()
        .mockReturnValueOnce({
          select: jest.fn().mockReturnThis(),
          addSelect: jest.fn().mockReturnThis(),
          where: jest.fn().mockReturnThis(),
          groupBy: jest.fn().mockReturnThis(),
          getRawMany: jest.fn().mockResolvedValueOnce(expectedLikes),
        });

      const result = await postLikeService.getLikesForAllPosts(mockPostIds);

      expect(mockPostLikeRepository.createQueryBuilder).toHaveBeenCalled();
      expect(result).toEqual(expectedLikes);
    });

    it('should throw an InternalServerErrorException if an error occurs', async () => {
      mockPostLikeRepository.createQueryBuilder = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockRejectedValue(new Error()),
      });

      await expect(
        postLikeService.getLikesForAllPosts(mockPostIds),
      ).rejects.toThrow(
        new InternalServerErrorException(
          'Something went wrong while processing your request. Please try again later.',
        ),
      );
    });
  });

  describe('likePost', () => {
    const postId = 1;
    const userId = 3;

    const existingPost = { id: postId, content: 'This is my first post.' };
    const existingLike = { post: { id: postId }, user: { id: userId } };

    it('should create a new post like if the user has not liked the post yet', async () => {
      mockPostRepository.findOne = jest.fn().mockResolvedValue(existingPost);
      mockPostLikeRepository.findOne = jest.fn().mockResolvedValue(undefined);

      await postLikeService.likePost(postId, userId);

      expect(mockPostRepository.findOne).toHaveBeenCalledWith({
        where: { id: postId },
      });
      expect(mockPostLikeRepository.findOne).toHaveBeenCalledWith({
        where: {
          post: { id: postId },
          user: { id: userId },
        },
        withDeleted: true,
      });
      expect(mockPostLikeRepository.insert).toHaveBeenCalledWith({
        post: { id: postId },
        user: { id: userId },
      });
    });

    it('should soft-delete the existing post like if the user has already liked the post', async () => {
      mockPostRepository.findOne = jest.fn().mockResolvedValue(existingPost);
      mockPostLikeRepository.findOne = jest
        .fn()
        .mockResolvedValue(existingLike);

      await postLikeService.likePost(postId, userId);

      expect(mockPostRepository.findOne).toHaveBeenCalledWith({
        where: { id: postId },
      });
      expect(mockPostLikeRepository.findOne).toHaveBeenCalledWith({
        where: {
          post: { id: postId },
          user: { id: userId },
        },
        withDeleted: true,
      });
      expect(mockPostLikeRepository.softDelete).toHaveBeenCalledWith({
        post: { id: postId },
        user: { id: userId },
      });
    });

    it('should restore the existing soft-deleted post like if the user has already liked the post and unliked it', async () => {
      const deletedLike = { ...existingLike, deleted_at: new Date() };

      mockPostRepository.findOne = jest.fn().mockResolvedValue(existingPost);
      mockPostLikeRepository.findOne = jest.fn().mockResolvedValue(deletedLike);

      await postLikeService.likePost(postId, userId);

      expect(mockPostRepository.findOne).toHaveBeenCalledWith({
        where: { id: postId },
      });
      expect(mockPostLikeRepository.findOne).toHaveBeenCalledWith({
        where: {
          post: { id: postId },
          user: { id: userId },
        },
        withDeleted: true,
      });
      expect(mockPostLikeRepository.restore).toHaveBeenCalledWith({
        post: { id: postId },
        user: { id: userId },
      });
    });

    it('should throw a NotFoundException if the post does not exist', async () => {
      mockPostRepository.findOne = jest.fn().mockResolvedValue(undefined);
      mockPostLikeRepository.findOne = jest.fn();

      await expect(postLikeService.likePost(postId, userId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw an InternalServerErrorException for other errors', async () => {});
  });
});
