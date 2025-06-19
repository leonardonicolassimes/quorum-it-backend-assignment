import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UsersController } from './user.controller';
import { User } from '../shared/entities/user.entity';
import { UserRole } from '../shared/entities/user-role.entity';
import { UserPermission } from '../shared/entities/user-permission.entity';
import { Role } from '../shared/entities/role.entity';
import { Permission } from '../shared/entities/permission.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Role,
      Permission,
      UserRole,
      UserPermission,
    ]),
  ],
  controllers: [UsersController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
