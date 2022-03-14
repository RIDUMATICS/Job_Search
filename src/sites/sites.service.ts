import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';
import * as shortid from 'shortid';
import { Site } from './sites.model';
import { CustomError } from '../utils';

@Injectable()
export class SitesService {
  private readonly siteRepository: Repository<Site>;

  constructor(
    @InjectEntityManager() private readonly entityManager: EntityManager,
  ) {
    this.siteRepository = entityManager.getRepository(Site);
  }

  async getSites(): Promise<Site[]> {
    return this.siteRepository.find();
  }

  async getSite(id: string): Promise<Site> {
    try {
      const site = await this.siteRepository.findOne(id);
      if (!site) {
        throw new CustomError('Site not found', HttpStatus.NOT_FOUND);
      }
      return site;
    } catch (error) {
      throw new HttpException(
        `Unable to get site: ${error.message}`,
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  async addSite(data: Site): Promise<Site> {
    try {
      const site = new Site();
      site.id = shortid.generate();
      site.url = data.url;
      site.companyName = data.companyName;
      site.path = data.path;

      const newSite = await this.siteRepository.save(site);
      return newSite;
    } catch (error) {
      throw new HttpException(
        `Unable to save site: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updateSite(id: string, data: Site): Promise<Site> {
    try {
      const site = await this.siteRepository.findOne(id);
      if (!site) {
        throw new CustomError('Site not found', HttpStatus.NOT_FOUND);
      }

      site.url = data.url || site.url;
      site.companyName = data.companyName || site.companyName;
      site.path = data.path || site.path;
      site.ignoredKeywords = data.ignoredKeywords || site.ignoredKeywords;

      const updatedSite = await this.siteRepository.save(site);
      return updatedSite;
    } catch (error) {
      throw new HttpException(
        `Unable to update site: ${error.message}`,
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  async deleteSite(id: string): Promise<Site> {
    try {
      const site = await this.siteRepository.findOne(id);
      if (!site) {
        throw new CustomError('Site not found', HttpStatus.NOT_FOUND);
      }
      const deletedSite = await this.siteRepository.remove(site);
      return deletedSite;
    } catch (error) {
      throw new HttpException(
        `Unable to delete site: ${error.message}`,
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }
}
