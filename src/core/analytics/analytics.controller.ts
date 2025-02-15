import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from 'src/common/guard/jwt.auth.guard';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get(':alias')
  getAnalytics(@Param('alias') alias: string) {
    return this.analyticsService.getAnalytics(alias);
  }

  @Get('topic/:topic')
  getAnalyticsByTopic(@Param('topic') topic: string) {
    return this.analyticsService.getAnalyticsByTopic(topic);
  }

  @UseGuards(JwtAuthGuard)
  @Get('user/overall')
  getUserAnalytics(@Req() req) {
    // console.log(req.user);
    return this.analyticsService.getUserAnalytics(req.user._id);
  }
}
