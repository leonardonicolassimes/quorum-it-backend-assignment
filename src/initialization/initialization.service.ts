import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../user/user.service';
import { CreateUserDto } from '../shared/dtos/create-user.dto';

@Injectable()
export class InitializationService implements OnModuleInit {
  private readonly logger = new Logger(InitializationService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UsersService,
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

      const name = process.env.SUPERADMIN_NAME!;
      const email = process.env.SUPERADMIN_EMAIL!;
      const password = process.env.SUPERADMIN_PASSWORD!;
      const hashedPassword = await bcrypt.hash(password, 10);

      const superAdmin = await this.userService.findByEmail(email);

      if (superAdmin) {
        this.logger.log('Superadmin already registered');
        return;
      }

      const newSuperAdmin: CreateUserDto = {
        name,
        email,
        password: hashedPassword,
      };

      await this.userService.create(newSuperAdmin);

      this.logger.log('Superadmin created successfully');
    } catch (error) {
      this.logger.error('Error on create superadmin', error);
    }
  }
}
