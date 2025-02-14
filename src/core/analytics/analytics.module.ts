import { forwardRef, Module } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { ShortenModule } from '../shorten/shorten.module';
import { Analytics, AnalyticsSchema } from './analytics.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    forwardRef(() => ShortenModule),
    MongooseModule.forFeature([
      {
        name: Analytics.name,
        schema: AnalyticsSchema,
      },
    ]),
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
