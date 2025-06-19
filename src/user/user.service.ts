import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
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
      relations: ['userRoles', 'userPermissions'],
    });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id, deletedAt: IsNull() },
      relations: ['userRoles', 'userPermissions'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.userRepository.findOne({
      where: { email, deletedAt: IsNull() },
    });

    return user || undefined;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.findByEmail(updateUserDto.email);
      if (existingUser) {
        throw new ConflictException('The new email is already registered');
      }
    }

    if (updateUserDto.password) {
      updateUserDto.password = await this.hashPassword(updateUserDto.password);
    }

    const updatedUser = this.userRepository.merge(user, updateUserDto);
    return await this.userRepository.save(updatedUser);
  }

  async remove(id: number): Promise<void> {
    const result = await this.userRepository.softDelete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  async restore(id: number): Promise<User> {
    const result = await this.userRepository.restore(id);

    if (result.affected === 0) {
      throw new NotFoundException(
        `User with ID ${id} not found or was not deleted`,
      );
    }

    return await this.findOne(id);
  }

  async addRole(userId: number, roleId: number): Promise<UserRole> {
    const role = await this.roleRepository.findOne({
      where: { id: roleId, deletedAt: IsNull() },
    });

    const user = await this.userRepository.findOne({
      where: { id: userId, deletedAt: IsNull() },
    });

    if (!role) {
      throw new NotFoundException(`Role with ID ${roleId} not found`);
    }

    const userRoleEntity = this.userRoleRepository.create({
      user: user ? { id: user.id } : undefined,
      role: { id: role.id },
    });

    const userRole = await this.userRoleRepository.save(userRoleEntity);

    return userRole;
  }

  async addPermission(
    userId: number,
    permissionId: number,
  ): Promise<UserPermission> {
    const permission = await this.userPermissionRepository.findOne({
      where: { id: permissionId, deletedAt: IsNull() },
    });

    const user = await this.userRepository.findOne({
      where: { id: userId, deletedAt: IsNull() },
    });

    if (!permission) {
      throw new NotFoundException(
        `Permission with ID ${permissionId} not found`,
      );
    }

    const userPermissionEntity = this.userPermissionRepository.create({
      user: user ? { id: user.id } : undefined,
      permission: { id: permission.id },
    });

    const userPermission =
      await this.userPermissionRepository.save(userPermissionEntity);

    return userPermission;
  }
}
