/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Permission } from '../shared/entities/permission.entity';
import { CreatePermissionDto } from '../shared/dtos/create-permission.dto';
import { UpdatePermissionDto } from '../shared/dtos/update-permission.dto';
import { UserPermission } from '../shared/entities/user-permission.entity';
import { RolePermission } from '../shared/entities/role-permission.entity';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
    @InjectRepository(UserPermission)
    private userPermissionRepository: Repository<UserPermission>,
    @InjectRepository(RolePermission)
    private rolePermissionRepository: Repository<RolePermission>,
  ) {}

  async create(createPermissionDto: CreatePermissionDto): Promise<Permission> {
    const existingPermission = await this.permissionRepository.findOne({
      where: { name: createPermissionDto.name, deletedAt: IsNull() },
    });

    if (existingPermission) {
      throw new ConflictException('Permission name already exists');
    }

    const permission = this.permissionRepository.create(createPermissionDto);
    return this.permissionRepository.save(permission);
  }

  async findAll(): Promise<Permission[]> {
    return this.permissionRepository.find({ where: { deletedAt: IsNull() } });
  }

  async findOne(id: number): Promise<Permission> {
    const permission = await this.permissionRepository.findOne({
      where: { id, deletedAt: IsNull() },
    });

    if (!permission) {
      throw new NotFoundException(`Permission with ID ${id} not found`);
    }

    return permission;
  }

  async findByName(name: string): Promise<Permission | undefined> {
    const permission = await this.permissionRepository.findOne({
      where: { name, deletedAt: IsNull() },
    });

    return permission || undefined;
  }

  async update(
    id: number,
    updatePermissionDto: UpdatePermissionDto,
  ): Promise<Permission> {
    const permission = await this.findOne(id);

    if (
      updatePermissionDto.name &&
      updatePermissionDto.name !== permission.name
    ) {
      const existingPermission = await this.permissionRepository.findOne({
        where: { name: updatePermissionDto.name, deletedAt: IsNull() },
      });

      if (existingPermission) {
        throw new ConflictException('Permission name already exists');
      }
    }

    Object.assign(permission, updatePermissionDto);
    return this.permissionRepository.save(permission);
  }

  async remove(id: number): Promise<void> {
    const permission = await this.permissionRepository.findOne({
      where: { id },
      withDeleted: true,
    });

    if (permission?.deletedAt) {
      throw new ConflictException(
        `Permission with ID ${id} aready was deleted`,
      );
    } else if (permission) {
      const result = await this.permissionRepository.softDelete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`Permission with ID ${id} not found`);
      }

      await this.userPermissionRepository.update(
        { permission: { id } },
        { deletedAt: new Date() },
      );

      await this.rolePermissionRepository.update(
        { permission: { id } },
        { deletedAt: new Date() },
      );
    } else {
      throw new NotFoundException(`Permission with ID ${id} not found`);
    }
  }

  async restore(id: number): Promise<Permission> {
    const permission = await this.permissionRepository.findOne({
      where: { id },
      withDeleted: true,
    });

    if (permission?.deletedAt) {
      const result = await this.permissionRepository.restore(id);
      if (result.affected === 0) {
        throw new NotFoundException(`Permission with ID ${id} not found`);
      }

      await this.userPermissionRepository.update(
        { permission: { id } },
        { deletedAt: null as any },
      );

      await this.rolePermissionRepository.update(
        { permission: { id } },
        { deletedAt: null as any },
      );
    } else if (permission) {
      throw new ConflictException(`Permission with ID ${id} not was deleted`);
    } else {
      throw new NotFoundException(`Permission with ID ${id} not found`);
    }

    return this.findOne(id);
  }
}
