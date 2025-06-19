import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from '../shared/entities/permission.entity';
import { PermissionService } from './permission.service';
import { PermissionController } from './permission.controller';
import { UserPermission } from '../shared/entities/user-permission.entity';
import { RolePermission } from '../shared/entities/role-permission.entity';
import { SuperAdminInterceptor } from '../shared/interceptors/superadmin.interceptor';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Permission, UserPermission, RolePermission]),
    UserModule,
  ],
  controllers: [PermissionController],
  providers: [PermissionService, SuperAdminInterceptor],
  exports: [
    TypeOrmModule.forFeature([Permission]),
    PermissionService,
    UserModule,
  ],
})
export class PermissionModule {}
