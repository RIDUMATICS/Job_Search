import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { SitesService } from './sites.service';

@Controller('sites')
export class SitesController {
  constructor(private readonly sitesService: SitesService) {}

  @Get()
  async getSites(): Promise<any> {
    return this.sitesService.getSites();
  }

  @Get(':id')
  async getSite(@Param('id') id: string): Promise<any> {
    return this.sitesService.getSite(id);
  }

  @Post()
  async addSite(@Body() body): Promise<any> {
    return this.sitesService.addSite(body);
  }
}
