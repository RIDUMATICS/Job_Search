import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectEntityManager } from '@nestjs/typeorm';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { sendMail } from '../utils';
import { EntityManager, Repository } from 'typeorm';
import { Site } from '../sites/sites.model';
import SearchKeywords from './searchKeywords.model';

@Injectable()
export class SearchService {
  private readonly siteRepository: Repository<Site>;
  private readonly searchKeywords: Repository<SearchKeywords>;

  constructor(
    @InjectEntityManager() private readonly entityManager: EntityManager,
  ) {
    this.siteRepository = entityManager.getRepository(Site);
    this.searchKeywords = entityManager.getRepository(SearchKeywords);
  }

  async addSearchKeyword(data) {
    const searchKeyword = new SearchKeywords();
    searchKeyword.keyword = data.keyword;

    await this.searchKeywords.save(searchKeyword);

    return searchKeyword;
  }

  async getAllSearchKeywords() {
    return this.searchKeywords.find();
  }

  async getJobs(): Promise<any[]> {
    const request = [];

    // get all website where not apply for jobs
    const sites = await this.siteRepository.find({
      where: { hasApplied: false },
    });

    // loop through all sites
    // fetch all jobs from site using non-blocking request
    for (const site of sites) {
      request.push(
        axios.get(site.url, {
          headers: {
            crawlPath: site.path,
            ignoredKeywords: site.ignoredKeywords,
          },
        }),
      );
    }

    const responses = await Promise.all(request);

    return responses;
  }

  async search() {
    let result = '';
    const searchKeywords = await this.getAllSearchKeywords();

    const responses = await this.getJobs();

    for (const response of responses) {
      const { crawlPath, ignoredKeywords } = response.config.headers;

      const $ = cheerio.load(response.data);

      $(crawlPath).each(function () {
        //remove some unwanted jobs for particular site
        if (!ignoredKeywords.some((keyword) => keyword === $(this).text())) {
          const job = $(this).text();
          if (
            searchKeywords.some(({ keyword }) =>
              job.toLowerCase().includes(keyword),
            )
          ) {
            result += `<li>Title: ${job}</li><li>Url: ${response.config.url}</li>`;
          }
        }
      });

      if (result !== '') {
        sendMail(`<ul>${result}</ul>`);
        console.log(`<ul>${result}</ul>`);
      }
    }
  }

  // search for jobs on all sites @12PM
  @Cron(CronExpression.EVERY_DAY_AT_NOON)
  async searchNoon() {
    await this.search();
    Logger.log(`Searched for jobs at noon on all sites by ${new Date()}`);
  }

  // search for jobs on all sites by COB
  @Cron(CronExpression.EVERY_DAY_AT_5PM)
  async searchCOB() {
    await this.search();
    Logger.log(`Searched for jobs at 5PM on all sites by ${new Date()}`);
  }
}
