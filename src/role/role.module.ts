import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from '../shared/entities/role.entity';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { Permission } from '../shared/entities/permission.entity';
import { RolePermission } from '../shared/entities/role-permission.entity';
import { PermissionModule } from '../permission/permission.module';
import { UserRole } from '../shared/entities/user-role.entity';
import { SuperAdminInterceptor } from '../shared/interceptors/superadmin.interceptor';

@Module({
  imports: [
    TypeOrmModule.forFeature([Role, Permission, RolePermission, UserRole]),
    PermissionModule,
  ],
  controllers: [RoleController],
  providers: [SuperAdminInterceptor, RoleService],
  exports: [TypeOrmModule.forFeature([Role]), RoleService],
})
export class RoleModule {}
