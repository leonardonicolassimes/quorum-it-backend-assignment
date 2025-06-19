import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { User } from './shared/entities/user.entity';
import { Role } from './shared/entities/role.entity';
import { Permission } from './shared/entities/permission.entity';
import { UserRole } from './shared/entities/user-role.entity';
import { UserPermission } from './shared/entities/user-permission.entity';
import { RolePermission } from './shared/entities/role-permission.entity';
import { UserModule } from './user/user.module';
import { InitializationModule } from './initialization/initialization.module';
import { RoleModule } from './role/role.module';
import { PermissionModule } from './permission/permission.module';

const dbPort = parseInt(process.env.DB_PORT || '5432');

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: dbPort,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [
        User,
        Role,
        Permission,
        UserRole,
        UserPermission,
        RolePermission,
      ],
      synchronize: false,
      autoLoadEntities: true,
    }),
    AuthModule,
    UserModule,
    InitializationModule,
    RoleModule,
    PermissionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
