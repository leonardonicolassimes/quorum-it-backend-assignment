/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Role } from '../shared/entities/role.entity';
import { CreateRoleDto } from '../shared/dtos/create-role.dto';
import { UpdateRoleDto } from '../shared/dtos/update-role.dto';
import { Permission } from '../shared/entities/permission.entity';
import { RolePermission } from '../shared/entities/role-permission.entity';
import { UserRole } from '../shared/entities/user-role.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
    @InjectRepository(RolePermission)
    private rolePermissionRepository: Repository<RolePermission>,
    @InjectRepository(UserRole)
    private userRoleRepository: Repository<UserRole>,
  ) {}

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const existingRole = await this.roleRepository.findOne({
      where: { name: createRoleDto.name, deletedAt: IsNull() },
    });

    if (existingRole) {
      throw new ConflictException('Role name already exists');
    }

    const role = this.roleRepository.create(createRoleDto);
    return this.roleRepository.save(role);
  }

  async findAll(): Promise<Role[]> {
    return this.roleRepository.find({
      where: { deletedAt: IsNull() },
      relations: {
        rolePermissions: {
          permission: true,
        },
      },
    });
  }

  async findOne(id: number): Promise<Role> {
    const role = await this.roleRepository.findOne({
      where: { id, deletedAt: IsNull() },
      relations: {
        rolePermissions: {
          permission: true,
        },
      },
    });

    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }

    return role;
  }

  async findByName(name: string): Promise<Role | undefined> {
    const role = await this.roleRepository.findOne({
      where: { name, deletedAt: IsNull() },
    });

    return role || undefined;
  }

  async update(id: number, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const role = await this.findOne(id);

    if (updateRoleDto.name && updateRoleDto.name !== role.name) {
      const existingRole = await this.roleRepository.findOne({
        where: { name: updateRoleDto.name, deletedAt: IsNull() },
      });

      if (existingRole) {
        throw new ConflictException('Role name already exists');
      }
    }

    Object.assign(role, updateRoleDto);
    return this.roleRepository.save(role);
  }

  async remove(id: number): Promise<void> {
    const role = await this.roleRepository.findOne({
      where: { id },
      withDeleted: true,
    });

    if (role?.deletedAt) {
      throw new ConflictException(`Role with ID ${id} aready was deleted`);
    } else if (role) {
      const result = await this.roleRepository.softDelete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`Role with ID ${id} not found`);
      }

      await this.userRoleRepository.update(
        { role: { id } },
        { deletedAt: new Date() },
      );
    } else {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }
  }

  async restore(id: number): Promise<Role> {
    const role = await this.roleRepository.findOne({
      where: { id },
      withDeleted: true,
    });

    if (role?.deletedAt) {
      const result = await this.roleRepository.restore(id);
      if (result.affected === 0) {
        throw new NotFoundException(`Role with ID ${id} not found`);
      }

      await this.userRoleRepository.update(
        { role: { id } },
        { deletedAt: null as any },
      );
    } else if (role) {
      throw new ConflictException(`Role with ID ${id} not was deleted`);
    } else {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }

    return this.findOne(id);
  }

  async addPermission(
    roleId: number,
    permissionId: number,
  ): Promise<RolePermission> {
    const role = await this.roleRepository.findOne({
      where: { id: roleId, deletedAt: IsNull() },
    });

    if (!role) {
      throw new ConflictException(`Role with ID ${roleId} not found`);
    }

    const permission = await this.permissionRepository.findOne({
      where: { id: permissionId, deletedAt: IsNull() },
    });

    if (!permission) {
      throw new NotFoundException(
        `Permission with ID ${permissionId} not found`,
      );
    }

    const permissionToRole = await this.rolePermissionRepository.findOne({
      where: {
        role: { id: roleId },
        permission: { id: permissionId },
        deletedAt: IsNull(),
      },
    });

    if (permissionToRole) {
      throw new ConflictException('Permission already assigned to role');
    }

    const rolePermissionEntity = this.rolePermissionRepository.create({
      role: { id: role.id },
      permission: { id: permission.id },
    });

    const rolePermission =
      await this.rolePermissionRepository.save(rolePermissionEntity);

    return rolePermission;
  }
}
