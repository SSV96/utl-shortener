import { Module } from '@nestjs/common';
import { AnalyticsModule } from './analytics/analytics.module';
import { ShortenModule } from './shorten/shorten.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [UserModule, AnalyticsModule, ShortenModule],
  exports: [UserModule, AnalyticsModule, ShortenModule],
})
export class CoreModule {}
