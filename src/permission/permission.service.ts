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

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
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
    const result = await this.permissionRepository.softDelete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Permission with ID ${id} not found`);
    }
  }

  async restore(id: number): Promise<Permission> {
    const result = await this.permissionRepository.restore(id);
    if (result.affected === 0) {
      throw new NotFoundException(
        `Permission with ID ${id} not found or not deleted`,
      );
    }
    return this.findOne(id);
  }
}
