import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../shared/entities/user.entity';
import { InitializationService } from './initialization.service';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from '../user/user.module';
import { RoleService } from '../role/role.service';
import { Role } from '../shared/entities/role.entity';
import { PermissionModule } from '../permission/permission.module';
import { RoleModule } from '../role/role.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role]),
    ConfigModule,
    UserModule,
    RoleModule,
    PermissionModule,
  ],
  providers: [InitializationService, RoleService],
  exports: [InitializationService],
})
export class InitializationModule {}
