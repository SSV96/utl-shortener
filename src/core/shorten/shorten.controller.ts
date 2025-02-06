import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ShortenService } from './shorten.service';
import { ShortenUrlDto } from './dto/shorten-url.dto';
import { JwtAuthGuard } from 'src/common/guard/jwt.auth.guard';
// import { JwtAuthGuard } from '../../common/guard/jwt.auth.guard';
@Controller('shorten')
export class ShortenController {
  constructor(private readonly shortenService: ShortenService) {}

  @Post()
  shortenUrl(@Body() shortenUrlDto: ShortenUrlDto) {
    return this.shortenService.shortenUrl(shortenUrlDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('test/:alias')
  getOriginalUrl(@Param('alias') alias: string) {
    return this.shortenService.getOriginalUrl(alias);
  }
}
