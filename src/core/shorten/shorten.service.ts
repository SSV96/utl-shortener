import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ShortenUrlDto } from './dto/shorten-url.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Shorten } from './shorten.schema';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import * as useragent from 'useragent';
import { AnalyticsService } from '../analytics/analytics.service';
import { validate } from 'nestjs-zod';

@Injectable()
export class ShortenService {
  private readonly logger = new Logger(ShortenService.name);
  constructor(
    @InjectModel(Shorten.name) private model: Model<Shorten>,
    private readonly configService: ConfigService,
    @Inject(forwardRef(() => AnalyticsService))
    private readonly analyticsService: AnalyticsService,
  ) {}

  async shortenUrl(shortenUrlDto: ShortenUrlDto, userId: string) {
    const { longUrl, customAlias } = shortenUrlDto;

    shortenUrlDto.longUrl =
      longUrl.startsWith('https://') || longUrl.startsWith('http://')
        ? longUrl
        : 'https://' + longUrl;
    const isUrlExists = await this.model.findOne({ longUrl });

    if (isUrlExists) {
      return new BadRequestException('URL already Exists');
    }
    const isCustomAliasExists = await this.model.findOne({ longUrl });

    if (isCustomAliasExists) {
      return new BadRequestException('CustomAlias already Exists');
    }

    const uniqueAlias = customAlias || this.generateUniqueAlias();

    const shortUrl = `${this.configService.getOrThrow('app.baseURL')}/${uniqueAlias}`;

    const newUrl = await this.model.create({
      ...shortenUrlDto,
      userId,
      shortUrl,
      customAlias: uniqueAlias,
    });

    return { shortUrl, createdAt: newUrl.createdAt };
  }

  async getOriginalUrl(alias: string) {
    const url = await this.model.findOne({ customAlias: alias });

    if (!url) {
      throw new BadRequestException('URL not found');
    }

    return url;
  }

  async getUserShortUrls(userId: string) {
    return this.model.find({ userId }).sort({ createdAt: -1 });
  }

  async deleteAll(userId: string) {
    return this.model.deleteMany({ userId });
  }
  private generateUniqueAlias(): string {
    return Math.random().toString(36).substring(2, 8);
  }

  async getUrls({
    customAlias,
    topic,
    userId,
  }: {
    customAlias?: string;
    topic?: string;
    userId?: string;
  }) {
    const data = await this.model.find({ customAlias, topic, userId });

    return data;
  }

  async getUrlByUserId(userId: string) {
    return await this.model.find({ userId });
  }
  async handleRedirect(alias: string, req: any): Promise<string | null> {
    const url = await this.getOriginalUrl(alias);

    if (!url) {
      return null;
    }

    const userAgent = req.headers['user-agent'] || 'Unknown';
    const ipAddress =
      req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    const agent = useragent.parse(userAgent);
    const osName = agent.os.toString();
    const deviceName = agent.device.toString();

    let geoLocation = null;
    try {
      geoLocation = await this.fetchGeolocation(ipAddress);
    } catch (geoError) {
      this.logger.error(
        `Failed to fetch geolocation data for IP: ${ipAddress}`,
        geoError.message,
      );
    }

    this.logger.log(
      `Redirecting to ${url.longUrl} | Timestamp: ${new Date().toISOString()} | User Agent: ${userAgent} | IP Address: ${ipAddress} | GeoLocation: ${JSON.stringify(
        geoLocation,
      )}`,
    );

    await this.analyticsService.recordClick(
      ipAddress,
      url.topic,
      deviceName,
      osName,
      alias,
    );

    return url.longUrl;
  }

  async fetchGeolocation(ipAddress: string): Promise<any> {
    try {
      const geoResponse = await axios.get(
        `http://api.ipstack.com/${ipAddress}`,
        {
          params: {
            access_key: this.configService.getOrThrow('ipstack.access_key'),
          },
        },
      );

      return {
        country: geoResponse.data.country_name || 'Unknown',
        region: geoResponse.data.region_name || 'Unknown',
        city: geoResponse.data.city || 'Unknown',
        latitude: geoResponse.data.latitude || 0,
        longitude: geoResponse.data.longitude || 0,
      };
    } catch (error) {
      this.logger.error(
        `Error fetching geolocation for IP: ${ipAddress}`,
        error.message,
      );
      throw error;
    }
  }
}
