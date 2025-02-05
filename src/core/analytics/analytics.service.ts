import { Injectable } from '@nestjs/common';

@Injectable()
export class AnalyticsService {
  getAnalytics() {
    return 'Analytics';
  }

  getAnalyticsByTopic() {
    return 'Analytics by topic';
  }
}
