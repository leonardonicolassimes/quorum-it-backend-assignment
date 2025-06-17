/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Expose } from 'class-transformer';

export class ResponseRolePermissionDto {
  @Expose()
  id: number;

  @Expose()
  roleId: number;

  @Expose()
  permissionId: number;

  @Expose({ name: 'createdAt' })
  created_at: Date;
}
