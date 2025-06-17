import { Injectable } from '@nestjs/common';
import { CommonResponse } from './shared/interfaces/commonTypes';

@Injectable()
export class AppService {
  getHealthStatus(): CommonResponse {
    return { status: 'OK', message: 'Everything is fine!' };
  }
}
