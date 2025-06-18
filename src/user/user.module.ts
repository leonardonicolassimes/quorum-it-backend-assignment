import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './user.service';
import { UsersController } from './user.controller';
import { User } from '../shared/entities/user.entity';
import { UserRole } from '../shared/entities/user-role.entity';
import { UserPermission } from '../shared/entities/user-permission.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserRole, UserPermission])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
