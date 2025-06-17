/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Expose } from 'class-transformer';

export class ResponseUserPermissionDto {
  @Expose()
  id: number;

  @Expose()
  userId: number;

  @Expose()
  permissionId: number;

  @Expose()
  createdAt: Date;
}
