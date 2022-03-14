import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from './config';
import { SitesModule } from './sites/sites.module';
import { SearchModule } from './search/search.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: config.db.host,
      port: config.db.port,
      username: config.db.username,
      password: config.db.password,
      database: config.db.name,
      entities: ['dist/**/*.model.js'],
      synchronize: true,
    }),
    SitesModule,
    SearchModule,
  ],
})
export class AppModule {}
