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
    let mockRepository = {
      findBy: jest.fn(),
      find: jest.fn(),
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
  /*
      ### 23.03.08
      ### 최호인
      ### 사용자 검색 테스트 코드
    */
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
  /*
      ### 23.03.08
      ### 최호인
      ### 음식점 검색 테스트 코드
    */
  it('restaurant search success', async () => {
    const keyword = 'gg';
    const mockRestaurant = [
      {
        id: 1,
        name: '복자씨 연탄구이',
        category_name: '음식점 > 한식 > 육류,고기',
        category_group_name: '음식점',
        phone_number: '064-782-7330',
        img_url: '호겨ㅑㄱ호',
        kakao_place_id: '1896620216',
        latitude: '33.4685316070004',
        longitude: '126.921242446619',
        number_address: '제주특별자치도 서귀포시 성산읍 오조리 7-2',
        raod_address: '제주특별자치도 서귀포시 성산읍 한도로 124',
      },
      {
        id: 2,
        name: '복자씨 연탄구이2',
        category_name: '음식점 > 한식 > 육류,고기',
        category_group_name: '음식점',
        phone_number: '064-782-7330',
        img_url: '호겨ㅑㄱ호',
        kakao_place_id: '1896620216',
        latitude: '33.4685316070004',
        longitude: '126.921242446619',
        number_address: '제주특별자치도 서귀포시 성산읍 오조리 7-2',
        raod_address: '제주특별자치도 서귀포시 성산읍 한도로 124',
      },
    ];

    mockUserRepository.findBy = jest
      .fn()
      .mockResolvedValueOnce(Promise.resolve(mockRestaurant));
    const result = await searchService.getRestaurantSearch(keyword);

    expect(result).toBe(mockRestaurant);
    expect(mockRestaurantRepository.findBy).toHaveBeenCalledTimes(1);
    expect(mockRestaurantRepository.findBy).toHaveBeenCalledWith({
      name: Like(`${keyword}%`),
    });
  });
  /*
      ### 23.03.09
      ### 최호인
      ### 해시태그 검색 테스트 코드
    */
  it('hashtag search success', async () => {
    const keyword = '카페';
    const mockHashtag = [
      {
        id: 1,
        name: '카페 아아 맛집',
      },
      {
        id: 2,
        name: '카페탐방',
      },
    ];

    mockUserRepository.findBy = jest
      .fn()
      .mockResolvedValueOnce(Promise.resolve(mockHashtag));
    const result = await searchService.getHashtagSearch(keyword);

    expect(result).toBe(mockHashtag);
    expect(mockHashtagRepository.findBy).toHaveBeenCalledTimes(1);
    expect(mockHashtagRepository.findBy).toHaveBeenCalledWith({
      name: Like(`${keyword}%`),
    });
  });

  /*
      ### 23.03.09
      ### 최호인
      ### 해시태그를 기반으로 포스팅 검색 테스트 코드
    */
  it('post search by hashtag success', async () => {
    const hashtag = '카페 탐방';
    const mockPostByHashtag = [
      {
        id: 1,
        name: '흑돼지맛집',
        createdAt: '2023-03-08T02:43:39.693Z',
        updatedAt: '2023-03-08T02:45:57.571Z',
        deleted_at: null,
        posts: [
          {
            id: 2,
            content: 'gdhrgh',
            rating: 7,
            img_url: 'ghudhgl',
            created_at: '2023-03-08T02:37:41.961Z',
            updated_at: '2023-03-08T02:37:41.961Z',
            deleted_at: null,
            visibility: 'public',
          },
        ],
      },
    ];

    mockHashtagRepository.find = jest
      .fn()
      .mockResolvedValueOnce(Promise.resolve(mockPostByHashtag));
    const result = await searchService.getPostSearchByHashtag(hashtag);

    expect(result).toBe(mockPostByHashtag);
    expect(mockHashtagRepository.find).toHaveBeenCalledTimes(1);
  });
});
