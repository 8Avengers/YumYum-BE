import { Controller, Get, Param, Query } from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}
  /*
      ### 23.03.06
      ### 최호인
      ### 사용자 정보 검색
    */
  @Get('/user')
  async getUserSearch(@Query('keyword') keyword: string) {
    console.log(keyword);
    return await this.searchService.getUserSearch(keyword);
  }
  /*
      ### 23.03.06
      ### 최호인
      ### 음식점 정보 검색
    */
  @Get('/restaurant')
  async getRestaurantSearch(@Query('keyword') keyword: string) {
    return await this.searchService.getRestaurantSearch(keyword);
  }
  /*
      ### 23.03.06
      ### 최호인
      ### 해시태그 검색
    */
  @Get('/hashtag')
  async getHashtagSearch(@Query('keyword') keyword: string) {
    return await this.searchService.getHashtagSearch(keyword);
  }
  /*
      ### 23.03.08
      ### 최호인
      ### 해시태그를 기반으로 포스팅 불러오기
    */
  @Get('/post')
  async getPostSearchByHashtag(@Query('hashtag') hashtag: string) {
    return await this.searchService.getPostSearchByHashtag(hashtag);
  }
}
