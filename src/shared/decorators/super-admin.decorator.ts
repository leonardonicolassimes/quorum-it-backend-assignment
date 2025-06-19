import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { SuperAdminInterceptor } from '../interceptors/superadmin.interceptor';

export function SuperAdmin() {
  return applyDecorators(UseInterceptors(SuperAdminInterceptor));
}
