import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: `${configService.get('db').mongo.uri}/${configService.get('db').mongo.dbName}`,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class MongoModule {}
