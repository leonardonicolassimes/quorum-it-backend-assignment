import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from '../shared/dtos/create-user.dto';
import { UpdateUserDto } from '../shared/dtos/update-user.dto';
import { ResponseUserDto } from '../shared/dtos/response-user.dto';
import { LegacySerialize } from '../shared/decorators/legacy-serialize.decorator';
import { ApiTags, ApiResponse, ApiOperation, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { User } from '../shared/entities/user.entity';
import { CurrentUser } from '../shared/decorators/current-user.decorator';

@ApiTags('Users')
@Controller('users')
// @UseGuards(JwtAuthGuard)
@LegacySerialize(ResponseUserDto)
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @LegacySerialize(ResponseUserDto)
  @Post('create')
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    type: ResponseUserDto,
  })
  @ApiResponse({ status: 409, description: 'Email is already registered' })
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'List of users',
    type: [ResponseUserDto],
  })
  async findAll() {
    return await this.userService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiParam({ name: 'id', description: 'User ID', type: Number })
  @ApiResponse({
    status: 200,
    description: 'User found',
    type: ResponseUserDto,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a user' })
  @ApiParam({
    name: 'id',
    description: 'ID of the user to update',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'User updated',
    type: ResponseUserDto,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({
    status: 409,
    description: 'The new email is already registered',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a user (soft delete)' })
  @ApiParam({
    name: 'id',
    description: 'ID of the user to delete',
    type: Number,
  })
  @ApiResponse({ status: 204, description: 'User deleted' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.remove(id);
  }

  @Post(':id/restore')
  @ApiOperation({ summary: 'Restore a deleted user' })
  @ApiParam({
    name: 'id',
    description: 'ID of the user to restore',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'User restored',
    type: ResponseUserDto,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found or was not deleted',
  })
  async restore(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.restore(id);
  }

  @Post('/addRole/:roleId')
  @ApiOperation({ summary: 'Add role to user' })
  addRole(
    @Param('roleId', ParseIntPipe) roleId: number,
    // @CurrentUser() user: User,
  ) {
    //return this.userService.addRole(user.id, roleId);
    return this.userService.addRole(2, roleId);
  }
}
