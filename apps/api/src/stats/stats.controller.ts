import { Controller, Get } from '@nestjs/common';
import { DashboardStats, StatsService } from './stats.service.js';

@Controller('stats')
export class StatsController {
  constructor(private readonly stats: StatsService) {}

  @Get()
  async overview(): Promise<DashboardStats> {
    return this.stats.getDashboardStats();
  }
}
