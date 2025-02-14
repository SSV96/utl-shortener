import { forwardRef, Module } from '@nestjs/common';
import { ShortenService } from './shorten.service';
import { ShortenController } from './shorten.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Shorten, ShortenSchema } from './shorten.schema';
import { AnalyticsModule } from '../analytics/analytics.module';

@Module({
  imports: [
    forwardRef(() => AnalyticsModule),
    MongooseModule.forFeature([
      {
        name: Shorten.name,
        schema: ShortenSchema,
      },
    ]),
  ],
  controllers: [ShortenController],
  providers: [ShortenService],
  exports: [ShortenService],
})
export class ShortenModule {}
