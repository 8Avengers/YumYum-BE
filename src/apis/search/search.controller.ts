import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SearchService } from './search.service';

@ApiTags('Search')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  /*
      ### 23.03.06
      ### 최호인
      ### 사용자 정보 검색
    */
  @ApiOperation({ summary: '회원 검색 및 데이터 받기' })
  @Get('/user')
  async getUserSearch(
    @Query('keyword') keyword: string,
    @Query('page') page: string,
  ) {
    return await this.searchService.getUserSearch(keyword, page);
  }

  /*
      ### 23.03.06
      ### 최호인
      ### 음식점 정보 검색
    */
  @ApiOperation({ summary: '음식점 정보 검색 및 데이터 받기' })
  @Get('/restaurant')
  async getRestaurantSearch(
    @Query('keyword') keyword: string,
    @Query('page') page: string,
  ) {
    return await this.searchService.getRestaurantSearch(keyword, page);
  }

  /*
      ### 23.03.06
      ### 최호인
      ### 해시태그 검색
    */
  @ApiOperation({ summary: '해시태그 정보 검색 및 데이터 받기' })
  @Get('/hashtag')
  async getHashtagSearch(
    @Query('keyword') keyword: string,
    @Query('page') page: string,
  ) {
    return await this.searchService.getHashtagSearch(keyword, page);
  }

  /*
      ### 23.03.08
      ### 최호인
      ### 해시태그를 기반으로 포스팅 불러오기
    */
  @ApiOperation({ summary: '해시태그를 기반으로 포스팅 불러오기' })
  @Get('/post')
  async getPostSearchByHashtag(
    @Query('hashtag') hashtag: string,
    @Query('page') page: string,
  ) {
    return await this.searchService.getPostSearchByHashtag(hashtag, page);
  }
}
