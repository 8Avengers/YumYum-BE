import { Controller, Get, Param, Query } from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('/user')
  async getUserSearch(@Query('keyword') keyword: string) {
    console.log(keyword);
    return await this.searchService.getUserSearch(keyword);
  }

  @Get('/restaurant')
  async getRestaurantSearch(@Query('keyword') keyword: string) {
    return await this.searchService.getRestaurantSearch(keyword);
  }

  @Get('/hashtag')
  async getHashtagSearch(@Query('keyword') keyword: string) {
    return await this.searchService.getHashtagSearch(keyword);
  }

  @Get('/post')
  async getPostSearchByHashtag(@Query('hashtag') hashtag: string) {
    return await this.searchService.getPostSearchByHashtag(hashtag);
  }
}
