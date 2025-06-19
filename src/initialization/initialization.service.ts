import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../shared/dtos/create-user.dto';
import { CreateRoleDto } from 'src/shared/dtos/create-role.dto';
import { RoleService } from 'src/role/role.service';

@Injectable()
export class InitializationService implements OnModuleInit {
  private readonly logger = new Logger(InitializationService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly roleService: RoleService,
  ) {}

  async onModuleInit() {
    await this.initializeSuperAdmin();
  }

  private async initializeSuperAdmin(): Promise<void> {
    try {
      const shouldInitialize = this.configService.get<boolean>(
        'SUPERADMIN_INITIALIZE',
        true,
      );

      if (!shouldInitialize) {
        this.logger.log('Superadmin initialize disabled');
        return;
      }

      const superadminRoleName = process.env.SUPERADMIN_ROLE_NAME!;
      const name = process.env.SUPERADMIN_NAME!;
      const email = process.env.SUPERADMIN_EMAIL!;
      const password = process.env.SUPERADMIN_PASSWORD!;
      const hashedPassword = await bcrypt.hash(password, 10);

      const superAdmin = await this.userService.findByEmail(email);

      if (superAdmin) {
        this.logger.log('Superadmin already registered');
        return;
      }

      const newSuperadminDto: CreateUserDto = {
        name,
        email,
        password: hashedPassword,
      };

      const newSuperadminUser = await this.userService.create(newSuperadminDto);
      const superadminRole =
        await this.roleService.findByName(superadminRoleName);

      if (!superadminRole) {
        const superadminRoleDto: CreateRoleDto = {
          name: superadminRoleName,
        };

        const newSuperAdminRole =
          await this.roleService.create(superadminRoleDto);

        if (newSuperAdminRole) {
          await this.userService.addRole(
            newSuperadminUser.id,
            newSuperAdminRole.id,
          );
        }
      }

      this.logger.log('Superadmin created successfully');
    } catch (error) {
      this.logger.error('Error on create superadmin', error);
    }
  }
}
