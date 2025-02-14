import { Module } from '@nestjs/common';
import { AnalyticsModule } from './analytics/analytics.module';
import { ShortenModule } from './shorten/shorten.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [UserModule, ShortenModule, AnalyticsModule],
  exports: [UserModule, ShortenModule, AnalyticsModule],
})
export class CoreModule {}
