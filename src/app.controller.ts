import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { GoogleAuthGuard } from './core/user/utils/google.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @UseGuards(GoogleAuthGuard)
  @Get('/homepage')
  homepage(@Req() req): string {
    return this.appService.getHello();
  }
}
