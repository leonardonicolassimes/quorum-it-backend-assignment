/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsInt, Min } from 'class-validator';

export class AssignPermissionToRoleDto {
  @IsInt({ message: 'Permission ID must be an integer number' })
  @Min(1, { message: 'Permision ID must be major than 0' })
  permissionId: number;
}
