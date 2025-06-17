/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Expose } from 'class-transformer';

export class ResponseUserRoleDto {
  @Expose()
  id: number;

  @Expose()
  userId: number;

  @Expose()
  roleId: number;

  @Expose()
  createdAt: Date;
}
