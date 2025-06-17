import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Role } from './role.entity';

@Entity('users_roles')
export class UserRole {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.userRoles)
  @JoinColumn({ name: 'user' })
  user: User;

  @ManyToOne(() => Role, (role) => role.userRoles)
  @JoinColumn({ name: 'role' })
  role: Role;

  @CreateDateColumn({ name: 'createdat', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedat', type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deletedat', type: 'timestamp', nullable: true })
  deletedAt: Date;
}
