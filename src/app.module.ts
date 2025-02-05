import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './common/common.module';
import { PassportModule } from '@nestjs/passport';
import { CoreModule } from './core/core.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ConfigModule } from './common/config/config.module';
import { JwtType } from './config';
@Module({
  imports: [
    CommonModule,
    CoreModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      global: true,
      useFactory: async (configService: ConfigService) => {
        const { secret, expiresIn } = configService.get<JwtType>('jwt');

        return {
          secret,
          signOptions: { expiresIn },
        };
      },
    }),
    PassportModule.registerAsync({
      useFactory: async () => ({
        session: false,
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
