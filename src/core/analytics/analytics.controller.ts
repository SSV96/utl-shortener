import { Controller, Get } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get(':alias')
  getAnalytics() {
    return this.analyticsService.getAnalytics();
  }

  @Get('topic/:topic')
  getAnalyticsByTopic() {
    return this.analyticsService.getAnalyticsByTopic();
  }
}
