import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { User } from '../shared/entities/user.entity';
import { CreateUserDto } from '../shared/dtos/create-user.dto';
import { UpdateUserDto } from '../shared/dtos/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email is already registered');
    }

    const hashedPassword = await this.hashPassword(createUserDto.password);

    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    return await this.usersRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return await this.usersRepository.find({
      where: { deletedAt: IsNull() },
      relations: ['userRoles', 'userPermissions'],
    });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id, deletedAt: IsNull() },
      relations: ['userRoles', 'userPermissions'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.usersRepository.findOne({
      where: { email, deletedAt: IsNull() },
    });

    return user || undefined;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.findByEmail(updateUserDto.email);
      if (existingUser) {
        throw new ConflictException('The new email is already registered');
      }
    }

    if (updateUserDto.password) {
      updateUserDto.password = await this.hashPassword(updateUserDto.password);
    }

    const updatedUser = this.usersRepository.merge(user, updateUserDto);
    return await this.usersRepository.save(updatedUser);
  }

  async remove(id: number): Promise<void> {
    const result = await this.usersRepository.softDelete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  async restore(id: number): Promise<User> {
    const result = await this.usersRepository.restore(id);

    if (result.affected === 0) {
      throw new NotFoundException(
        `User with ID ${id} not found or was not deleted`,
      );
    }

    return await this.findOne(id);
  }
}
