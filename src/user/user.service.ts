/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, IsNull, Not, Repository } from 'typeorm';
import { User } from '../shared/entities/user.entity';
import { CreateUserDto } from '../shared/dtos/create-user.dto';
import { UpdateUserDto } from '../shared/dtos/update-user.dto';
import { UserRole } from '../shared/entities/user-role.entity';
import { UserPermission } from '../shared/entities/user-permission.entity';
import { Role } from '../shared/entities/role.entity';
import { Permission } from '../shared/entities/permission.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
    @InjectRepository(UserRole)
    private userRoleRepository: Repository<UserRole>,
    @InjectRepository(UserPermission)
    private userPermissionRepository: Repository<UserPermission>,
  ) {}

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email is already registered');
    }

    const hashedPassword = await this.hashPassword(createUserDto.password);

    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    return await this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find({
      where: { deletedAt: IsNull() },
      relations: {
        userRoles: {
          role: true,
          user: true,
        },
        userPermissions: {
          permission: true,
          user: true,
        },
      },
    });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id, deletedAt: IsNull() },
      relations: {
        userRoles: {
          role: true,
          user: true,
        },
        userPermissions: {
          permission: true,
          user: true,
        },
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByEmail(
    email: string,
    withRelations = true,
  ): Promise<User | undefined> {
    const findOptions: FindOneOptions<User> = {
      where: { email, deletedAt: IsNull() },
    };

    if (withRelations) {
      findOptions.relations = {
        userRoles: {
          role: true,
          user: true,
        },
        userPermissions: {
          permission: true,
          user: true,
        },
      };
    }

    const user = await this.userRepository.findOne(findOptions);

    return user || undefined;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    if (updateUserDto.password) {
      updateUserDto.password = await this.hashPassword(updateUserDto.password);
    }

    const updatedUser = this.userRepository.merge(user, updateUserDto);
    return await this.userRepository.save(updatedUser);
  }

  async remove(id: number): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id },
      withDeleted: true,
    });

    if (user?.deletedAt) {
      throw new ConflictException(`User with ID ${id} aready was deleted`);
    } else if (user) {
      const result = await this.userRepository.softDelete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
    } else {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  async restore(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      withDeleted: true,
    });

    if (user?.deletedAt) {
      const result = await this.userRepository.restore(id);
      if (result.affected === 0) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
    } else if (user) {
      throw new ConflictException(`User with ID ${id} not was deleted`);
    } else {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return await this.findOne(id);
  }

  async addRole(userId: number, roleId: number): Promise<UserRole> {
    const user = await this.userRepository.findOne({
      where: { id: userId, deletedAt: IsNull() },
    });

    if (!user) {
      throw new ConflictException(`User with ID ${userId} not found`);
    }

    const role = await this.roleRepository.findOne({
      where: { id: roleId, deletedAt: IsNull() },
    });

    if (!role) {
      throw new NotFoundException(`Role with ID ${roleId} not found`);
    }

    const roleToUser = await this.userRoleRepository.findOne({
      where: {
        user: { id: userId },
        role: { id: roleId },
        deletedAt: IsNull(),
      },
    });

    if (roleToUser) {
      throw new ConflictException('Role already assigned to user');
    }

    const userRoleEntity = this.userRoleRepository.create({
      user: { id: user.id },
      role: { id: role.id },
    });

    const userRole = await this.userRoleRepository.save(userRoleEntity);

    return userRole;
  }

  async addPermission(
    userId: number,
    permissionId: number,
  ): Promise<UserPermission> {
    const user = await this.userRepository.findOne({
      where: { id: userId, deletedAt: IsNull() },
    });

    if (!user) {
      throw new ConflictException(`User with ID ${userId} not found`);
    }

    const permission = await this.permissionRepository.findOne({
      where: { id: permissionId, deletedAt: IsNull() },
    });

    if (!permission) {
      throw new NotFoundException(
        `Permission with ID ${permissionId} not found`,
      );
    }

    const permissionToUser = await this.userPermissionRepository.findOne({
      where: {
        user: { id: userId },
        permission: { id: permissionId },
        deletedAt: IsNull(),
      },
    });

    if (permissionToUser) {
      throw new ConflictException('Permission already assigned to user');
    }

    const userPermissionEntity = this.userPermissionRepository.create({
      user: { id: user.id },
      permission: { id: permission.id },
    });

    const userPermission =
      await this.userPermissionRepository.save(userPermissionEntity);

    return userPermission;
  }
}
