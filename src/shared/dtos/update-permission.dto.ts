/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsOptional, Length } from 'class-validator';

export class UpdatePermissionDto {
  @IsOptional()
  @Length(2, 100, {
    message: 'Name must contain between 2 and 100 characters',
  })
  name?: string;
}
