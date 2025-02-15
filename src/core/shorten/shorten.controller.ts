import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
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

import { ConfigService } from '@nestjs/config';
@Controller('shorten')
export class ShortenController {
  constructor(
    private readonly shortenService: ShortenService,
    private readonly configService: ConfigService,
  ) {}
  private readonly logger = new Logger(ShortenController.name);

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
  @Get()
  getUserShortUrls(@Req() req: AuthenticatedRequest) {
    const { _id } = req.user;
    return this.shortenService.getUserShortUrls(_id);
  }

  @Get('/:alias')
  async getOriginalUrl(@Param('alias') alias: string, @Req() req, @Res() res) {
    const longUrl = await this.shortenService.handleRedirect(alias, req);

    res.redirect(`${longUrl}`);
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  deleteAll(@Req() req) {
    return this.shortenService.deleteAll(req.user._id);
  }
}
