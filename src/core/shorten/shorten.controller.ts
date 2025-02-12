import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ShortenService } from './shorten.service';
import { ShortenUrlDto } from './dto/shorten-url.dto';
import { JwtAuthGuard } from 'src/common/guard/jwt.auth.guard';
import { AuthenticatedRequest } from 'src/common/interfaces/interface/authenticated.request.interface';

@Controller('shorten')
export class ShortenController {
  constructor(private readonly shortenService: ShortenService) {}
  @UseGuards(JwtAuthGuard)
  @Post()
  shortenUrl(
    @Body() shortenUrlDto: ShortenUrlDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const { _id } = req.user;
    return this.shortenService.shortenUrl(shortenUrlDto, _id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:alias')
  getOriginalUrl(
    @Param('alias') alias: string,
    @Req() req: AuthenticatedRequest,
    @Res() res,
  ) {
    const { _id } = req.user;
    const longUrl = this.shortenService.getOriginalUrl(alias, _id);
    res.redirect(longUrl);
  }
}
