import { Module } from '@nestjs/common';
import {ModeStatisticsDbService} from './mode-statistics/mode-statistics-db.service';

@Module({
  providers: [ModeStatisticsDbService],
  exports: [ModeStatisticsDbService],
})
export class DatabaseModule {}
