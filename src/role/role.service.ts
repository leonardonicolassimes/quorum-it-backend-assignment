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

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
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
      relations: ['rolePermissions', 'rolePermissions.permission'],
    });
  }

  async findOne(id: number): Promise<Role> {
    const role = await this.roleRepository.findOne({
      where: { id, deletedAt: IsNull() },
      relations: ['rolePermissions', 'rolePermissions.permission'],
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
    const result = await this.roleRepository.softDelete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }
  }

  async restore(id: number): Promise<Role> {
    const result = await this.roleRepository.restore(id);
    if (result.affected === 0) {
      throw new NotFoundException(
        `Role with ID ${id} not found or not deleted`,
      );
    }
    return this.findOne(id);
  }

  async addPermission(roleId: number, permissionId: number): Promise<Role> {
    const role = await this.findOne(roleId);
    const permission = await this.permissionRepository.findOne({
      where: { id: permissionId, deletedAt: IsNull() },
    });

    if (!permission) {
      throw new NotFoundException(
        `Permission with ID ${permissionId} not found`,
      );
    }

    return role;
  }
}
