import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Analytics } from './analytics.schema';
import { Model } from 'mongoose';
import { ShortenService } from '../shorten/shorten.service';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectModel(Analytics.name) private readonly model: Model<Analytics>,

    private readonly shortenService: ShortenService,
  ) {}

  async recordClick(
    ipAddress: string,
    topic: string,
    deviceName: string,
    osName: string,
    alias: string | null,
  ) {
    const currentDate = new Date().toISOString().split('T')[0];

    let entry = await this.model.findOne({
      ipAddress,
      topic,
      customAlias: alias,
      date: currentDate,
    });

    if (entry) {
      entry.clickCount += 1;
    } else {
      // console.log({
      //   ipAddress,
      //   topic,
      //   deviceName,
      //   osName,
      //   alias,
      // });
      const url = await this.shortenService.getOriginalUrl(alias);

      entry = new this.model({
        ipAddress,
        topic,
        deviceName,
        osName,
        urlId: url._id,
        customAlias: alias,
        clickCount: 1,
        date: currentDate,
      });
    }

    await entry.save();
  }

  async getAnalytics(alias: string | null) {
    const last7Days = [...Array(7)].map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    });

    const records = await this.model.find({
      customAlias: alias,
      date: { $in: last7Days },
    });

    const totalClicks = records.reduce(
      (sum, record) => sum + record.clickCount,
      0,
    );
    const uniqueUsers = new Set(records.map((record) => record.ipAddress)).size;

    const clicksByDate = last7Days.map((date) => ({
      date,
      clickCount: records
        .filter((record) => record.date === date)
        .reduce((sum, record) => sum + record.clickCount, 0),
    }));

    const osType = records
      .reduce((acc, record) => {
        const os = acc.find((o) => o.osName === record.osName);
        if (os) {
          os.uniqueClicks += record.clickCount;
          os.uniqueUsers.add(record.ipAddress);
        } else {
          acc.push({
            osName: record.osName,
            uniqueClicks: record.clickCount,
            uniqueUsers: new Set([record.ipAddress]),
          });
        }
        return acc;
      }, [])
      .map((os) => ({
        osName: os.osName,
        uniqueClicks: os.uniqueClicks,
        uniqueUsers: os.uniqueUsers.size,
      }));

    const deviceType = records
      .reduce((acc, record) => {
        const device = acc.find((d) => d.deviceName === record.deviceName);
        if (device) {
          device.uniqueClicks += record.clickCount;
          device.uniqueUsers.add(record.ipAddress);
        } else {
          acc.push({
            deviceName: record.deviceName,
            uniqueClicks: record.clickCount,
            uniqueUsers: new Set([record.ipAddress]),
          });
        }
        return acc;
      }, [])
      .map((device) => ({
        deviceName: device.deviceName,
        uniqueClicks: device.uniqueClicks,
        uniqueUsers: device.uniqueUsers.size,
      }));

    return {
      totalClicks,
      uniqueUsers,
      clicksByDate,
      osType,
      deviceType,
    };
  }

  async getUserAnalytics(userId: string) {
    // console.log('getUserAnalytics', { userId });
    const last7Days = [...Array(7)].map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    });

    const userUrls = await this.shortenService.getUrlByUserId(userId);
    // console.log({ userUrls });
    const totalUrls = userUrls.length;

    const urlIds = userUrls.map((url) => url._id);
    const records = await this.model.find({ urlId: { $in: urlIds } });

    const totalClicks = records.reduce(
      (sum, record) => sum + record.clickCount,
      0,
    );

    const uniqueUsers = new Set(records.map((record) => record.ipAddress)).size;

    const clicksByDate = last7Days.map((date) => ({
      date,
      clickCount: records
        .filter((record) => record.date === date)
        .reduce((sum, record) => sum + record.clickCount, 0),
    }));

    const osType = records
      .reduce((acc, record) => {
        const os = acc.find((o) => o.osName === record.osName);
        if (os) {
          os.uniqueClicks += record.clickCount;
          os.uniqueUsers.add(record.ipAddress);
        } else {
          acc.push({
            osName: record.osName,
            uniqueClicks: record.clickCount,
            uniqueUsers: new Set([record.ipAddress]),
          });
        }
        return acc;
      }, [])
      .map((os) => ({
        osName: os.osName,
        uniqueClicks: os.uniqueClicks,
        uniqueUsers: os.uniqueUsers.size,
      }));

    const deviceType = records
      .reduce((acc, record) => {
        const device = acc.find((d) => d.deviceName === record.deviceName);
        if (device) {
          device.uniqueClicks += record.clickCount;
          device.uniqueUsers.add(record.ipAddress);
        } else {
          acc.push({
            deviceName: record.deviceName,
            uniqueClicks: record.clickCount,
            uniqueUsers: new Set([record.ipAddress]),
          });
        }
        return acc;
      }, [])
      .map((device) => ({
        deviceName: device.deviceName,
        uniqueClicks: device.uniqueClicks,
        uniqueUsers: device.uniqueUsers.size,
      }));

    return {
      totalUrls,
      totalClicks,
      uniqueUsers,
      clicksByDate,
      osType,
      deviceType,
    };
  }

  async getAnalyticsByTopic(topic: string) {
    const urls = await this.shortenService.getUrls({ topic });

    const urlIds = urls.map((url) => url._id);
    const records = await this.model.find({ urlId: { $in: urlIds } });

    const totalClicks = records.reduce(
      (sum, record) => sum + record.clickCount,
      0,
    );

    const uniqueUsers = new Set(records.map((record) => record.ipAddress)).size;

    const last7Days = [...Array(7)].map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    });

    const clicksByDate = last7Days.map((date) => ({
      date,
      clickCount: records
        .filter((record) => record.date === date)
        .reduce((sum, record) => sum + record.clickCount, 0),
    }));

    const urlsAnalytics = urls.map((url) => {
      const urlRecords = records.filter((record) => record.urlId === url._id);

      const urlClicks = urlRecords.reduce(
        (sum, record) => sum + record.clickCount,
        0,
      );
      const urlUniqueUsers = new Set(
        urlRecords.map((record) => record.ipAddress),
      ).size;

      return {
        shortUrl: url.shortUrl,
        totalClicks: urlClicks,
        uniqueUsers: urlUniqueUsers,
      };
    });

    return {
      totalClicks,
      uniqueUsers,
      clicksByDate,
      urls: urlsAnalytics,
    };
  }
}
