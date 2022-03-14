import { Body, Controller, Post } from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Post()
  async addSearchKeyword(@Body() body): Promise<any> {
    return this.searchService.addSearchKeyword(body);
  }

  async getAllSearchKeywords(): Promise<any> {
    return this.searchService.getAllSearchKeywords();
  }
}
