import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { CommonResponse } from './shared/interfaces/commonTypes';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  getHello(): CommonResponse {
    return this.appService.getHealthStatus();
  }
}
