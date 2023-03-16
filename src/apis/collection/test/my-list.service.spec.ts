import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { Collection } from '../entities/collection.entity';
import { CollectionItem } from '../entities/collection-item.entity';
import { MyListService } from '../my-list.service';
import { InternalServerErrorException } from '@nestjs/common';

describe('MyListService', () => {
  let myListService: MyListService;
  let mockMyListRepository: jest.Mocked<Repository<Collection>>;
  let mockMyListItemRepository: jest.Mocked<Repository<CollectionItem>>;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        MyListService,
        {
          provide: getRepositoryToken(Collection),
          useValue: {
            find: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(CollectionItem),
          useValue: {},
        },
      ],
    }).compile();

    myListService = moduleRef.get<MyListService>(MyListService);
    (mockMyListRepository.find as jest.Mock).mockResolvedValue([
      {
        id: 1,
        type: 'myList',
        name: 'MyList1',
        description: 'description1',
        image: 'image1',
      },
      {
        id: 2,
        type: 'myList',
        name: 'MyList2',
        description: 'description2',
        image: 'image2',
      },
    ] as Collection[]);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('getMyListsName', () => {
    const mockUserId = 1;
    it('should return an array of names of all myList collections', async () => {
      const myLists = await myListService.getMyListsName(mockUserId);

      expect(mockMyListRepository.find).toHaveBeenCalledWith({
        where: { user_id: mockUserId, deletedAt: null, type: 'myList' },
        select: { name: true },
      });
      expect(myLists).toEqual([{ name: 'MyList1' }, { name: 'MyList2' }]);
    });

    it('should throw an InternalServerErrorException if an error occurs', async () => {
      mockMyListRepository.find.mockRejectedValue(new Error());

      await expect(myListService.getMyListsName(mockUserId)).rejects.toThrow(
        new InternalServerErrorException(
          'Something went wrong while processing your request. Please try again later.',
        ),
      );
    });
  });
});
