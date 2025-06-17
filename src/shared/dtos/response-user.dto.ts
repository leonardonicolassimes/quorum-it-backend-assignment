/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Expose } from 'class-transformer';

export class ResponseUserDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  email: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
