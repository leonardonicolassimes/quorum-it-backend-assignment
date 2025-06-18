import { UseInterceptors } from '@nestjs/common';
import { LegacySerializeInterceptor } from '../interceptors/legacy-serialize.interceptor';

export function LegacySerialize(dto: any) {
  return UseInterceptors(new LegacySerializeInterceptor(dto));
}
