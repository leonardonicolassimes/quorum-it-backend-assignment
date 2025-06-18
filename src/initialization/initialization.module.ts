import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../shared/entities/user.entity';
import { InitializationService } from './initialization.service';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), ConfigModule, UsersModule],
  providers: [InitializationService],
  exports: [InitializationService],
})
export class InitializationModule {}
