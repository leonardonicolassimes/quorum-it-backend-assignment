/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsInt, Min } from 'class-validator';

export class AssignRoleToUserDto {
  @IsInt({ message: 'Role ID must be an integer number' })
  @Min(1, { message: 'Role ID must be major than 0' })
  roleId: number;

  @IsInt({ message: 'User ID must be an integer number' })
  @Min(1, { message: 'User ID must be major than 0' })
  userId: number;
}
