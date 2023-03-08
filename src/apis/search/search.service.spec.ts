import { Like } from 'typeorm';
import { Hashtag } from './../post/entities/hashtag.entity';
import { Restaurant } from './../restaurant/entities/restaurant.entity';
import { User } from './../user/entities/user.entity';
import { Repository } from 'typeorm/repository/Repository';
import { SearchService } from './search.service';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('Search Service', () => {
  let searchService: SearchService;
  let mockUserRepository: Repository<User>;
  let mockRestaurantRepository: Repository<Restaurant>;
  let mockHashtagRepository: Repository<Hashtag>;

  beforeEach(async () => {
    let mockUser;
    let mockRestaurant;
    let mockHashtag;

    let mockRepository = {
      findBy: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        SearchService,
        {
          provide: getRepositoryToken(User),
          useFactory: () => mockRepository,
        },
        {
          provide: getRepositoryToken(Restaurant),
          useFactory: () => mockRepository,
        },
        {
          provide: getRepositoryToken(Hashtag),
          useFactory: () => mockRepository,
        },
      ],
    }).compile();

    searchService = moduleRef.get<SearchService>(SearchService);
    mockUserRepository = moduleRef.get<Repository<User>>(
      getRepositoryToken(User),
    );
    mockHashtagRepository = moduleRef.get<Repository<Hashtag>>(
      getRepositoryToken(Hashtag),
    );
    mockRestaurantRepository = moduleRef.get<Repository<Restaurant>>(
      getRepositoryToken(Restaurant),
    );
  });

  it('user search success', async () => {
    const keyword = 'gg';
    const mockUser = [
      {
        id: 689,
        name: 'Gibbie Ganforth',
        email: 'gganforthj4@abc.net.au',
        password: 'oHJH3VA',
        nickname: 'gganforthj4',
        phone_number: '369-243-0876',
        gender: 'F',
        birth: '2022-04-16T15:00:00.000Z',
        profile_image:
          'sapien urna pretium nisl ut volutpat sapien arcu sed augue',
      },
      {
        id: 692,
        name: 'Gregory Gillio',
        email: 'ggillioj7@bloglovin.com',
        password: 'tWrQP7TSN',
        nickname: 'ggillioj7',
        phone_number: '965-656-8933',
        gender: 'F',
        birth: '2018-05-05T15:00:00.000Z',
        profile_image:
          'non lectus aliquam sit amet diam in magna bibendum imperdiet nullam orci pede venenatis non sodales sed tincidunt',
      },
    ];

    mockUserRepository.findBy = jest
      .fn()
      .mockResolvedValueOnce(Promise.resolve(mockUser));
    const result = await searchService.getUserSearch(keyword);

    console.log(result);

    expect(result).toBe(mockUser);
    expect(mockUserRepository.findBy).toHaveBeenCalledTimes(1);
    expect(mockUserRepository.findBy).toHaveBeenCalledWith({
      nickname: Like(`${keyword}%`),
    });
  });
});
