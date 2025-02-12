import { Module } from '@nestjs/common';
import { ShortenService } from './shorten.service';
import { ShortenController } from './shorten.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Shorten, ShortenSchema } from './shorten.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Shorten.name,
        schema: ShortenSchema,
      },
    ]),
  ],
  controllers: [ShortenController],
  providers: [ShortenService],
})
export class ShortenModule {}
