import { Injectable } from '@nestjs/common';
import { ShortenUrlDto } from './dto/shorten-url.dto';

@Injectable()
export class ShortenService {
  shortenUrl(shortenUrlDto: ShortenUrlDto) {
    const shortUrl = Math.random().toString(36).substring(2, 8);
    return { ...shortenUrlDto, shortUrl };
  }

  getOriginalUrl(alias: string): string {
    return 'XXXXXXXXXXXXXXXXXXXXXX' + alias;
  }
}
