/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Expose } from 'class-transformer';

export class ResponseRoleDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
