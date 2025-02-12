import { BadRequestException, Injectable } from '@nestjs/common';
import { ShortenUrlDto } from './dto/shorten-url.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Shorten } from './shorten.schema';
import { Model } from 'mongoose';
import * as assert from 'assert';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class ShortenService {
  constructor(
    @InjectModel(Shorten.name) private model: Model<Shorten>,
    private readonly configService: ConfigService,
  ) {}

  async shortenUrl(shortenUrlDto: ShortenUrlDto, userId: string) {
    const { longUrl, customAlias } = shortenUrlDto;

    const existingUrl = await this.model.findOne({
      $or: [{ longUrl }, { customAlias }],
    });

    assert(
      existingUrl,
      new BadRequestException('URL or customAlias already Exists'),
    );

    const uniqueAlias = customAlias || this.generateUniqueAlias();
    const shortUrl = this.configService.getOrThrow('app.baseURL');

    const newUrl = await this.model.create({
      ...shortenUrlDto,
      userId,
      shortUrl,
      customAlias: uniqueAlias,
    });

    return { shortUrl, createdAt: newUrl.createdAt };
  }

  async getOriginalUrl(alias: string, userId: string): Promise<string> {
    const url = await this.model.findOne({ customAlias: alias });

    if (!url) {
      throw new BadRequestException('URL not found');
    }

    if (url.userId !== userId) {
      throw new BadRequestException(
        'You are not authorized to access this URL',
      );
    }
    return url.longUrl;
  }

  private generateUniqueAlias(): string {
    return Math.random().toString(36).substring(2, 8);
  }
}
