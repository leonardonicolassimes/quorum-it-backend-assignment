import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { UserRole } from './user-role.entity';
import { RolePermission } from './role-permission.entity';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @CreateDateColumn({ name: 'createdat', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedat', type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deletedat', type: 'timestamp', nullable: true })
  deletedAt: Date;

  @OneToMany(() => UserRole, (userRole) => userRole.role)
  userRoles: UserRole[];

  @OneToMany(() => RolePermission, (rolePermission) => rolePermission.role)
  rolePermissions: RolePermission[];
}
