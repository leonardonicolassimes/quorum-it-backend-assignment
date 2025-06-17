import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Role } from './role.entity';
import { Permission } from './permission.entity';

@Entity('roles_permissions')
export class RolePermission {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Role, (role) => role.rolePermissions)
  @JoinColumn({ name: 'role' })
  role: Role;

  @ManyToOne(() => Permission, (permission) => permission.rolePermissions)
  @JoinColumn({ name: 'permission' })
  permission: Permission;

  @CreateDateColumn({ name: 'createdat', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedat', type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deletedat', type: 'timestamp', nullable: true })
  deletedAt: Date;
}
