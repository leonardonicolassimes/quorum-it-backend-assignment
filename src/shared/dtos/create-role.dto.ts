/* eslint-disable @typescript-eslint/no-unsafe-call */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Length } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({ example: 'coordinator' })
  @IsNotEmpty({ message: 'Name is required' })
  @Length(2, 100, {
    message: 'Name must contain between 2 and 100 characters',
  })
  name: string;
}
