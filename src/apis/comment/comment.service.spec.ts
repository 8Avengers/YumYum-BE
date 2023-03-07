import { Test, TestingModule } from '@nestjs/testing';
import { CommentService } from './comment.service';
import {
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PostService } from '../post/post.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { Repository } from 'typeorm';

describe('CommentService', () => {
  let commentService: CommentService;
  let mockCommentRepository: Repository<Comment>;

  const mockPostService = {
    getPostById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentService,
        { provide: PostService, useValue: mockPostService },
        {
          provide: getRepositoryToken(Comment),
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

    commentService = module.get<CommentService>(CommentService);
    mockCommentRepository = module.get<Repository<Comment>>(
      getRepositoryToken(Comment),
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(commentService).toBeDefined();
  });

  describe('getAllComments', () => {
    const testPostId = 1;
    const testComments = [
      { content: 'test comment 1', user: { nickname: 'user1' } },
      { content: 'test comment 2', user: { nickname: 'user2' } },
    ];

    it('should return all comments for a given post', async () => {
      mockPostService.getPostById.mockResolvedValueOnce({});
      mockCommentRepository.createQueryBuilder = jest.fn().mockReturnValueOnce({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValueOnce(testComments),
      });

      const result = await commentService.getAllComments(testPostId);

      expect(mockPostService.getPostById).toHaveBeenCalledWith(testPostId);
      expect(mockCommentRepository.createQueryBuilder).toHaveBeenCalled();
      expect(result).toEqual(testComments);
    });

    it('should throw a NotFoundException if no posts are found', async () => {
      mockPostService.getPostById.mockRejectedValueOnce(
        new NotFoundException('No posts found.'),
      );

      await expect(
        commentService.getAllComments(testPostId),
      ).rejects.toThrowError(new NotFoundException('No posts found.'));
    });

    it('should throw a NotFoundException if no comments are found', async () => {
      mockPostService.getPostById.mockResolvedValueOnce({});
      mockCommentRepository.createQueryBuilder = jest.fn().mockReturnValueOnce({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValueOnce([]),
      } as any);

      await expect(
        commentService.getAllComments(testPostId),
      ).rejects.toThrowError(new NotFoundException('No comments found.'));
    });

    it('should throw an InternalServerErrorException if an error occurs', async () => {
      mockCommentRepository.createQueryBuilder = jest
        .fn()
        .mockImplementationOnce(() => {
          throw new Error('Something went wrong');
        });

      await expect(
        commentService.getAllComments(testPostId),
      ).rejects.toThrowError(
        new InternalServerErrorException(
          'Something went wrong while processing your request. Please try again later.',
        ),
      );
    });
  });
});
