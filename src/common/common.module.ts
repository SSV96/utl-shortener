import { Global, Module } from '@nestjs/common';
import { MongoModule } from './mongo/mongo.module';
import { ConfigModule } from './config/config.module';
@Global()
@Module({
  imports: [ConfigModule, MongoModule],
  exports: [ConfigModule, MongoModule],
})
export class CommonModule {}
