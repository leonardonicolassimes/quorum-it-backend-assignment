/* eslint-disable @typescript-eslint/no-unsafe-call */
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Length, Matches } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'Jhon' })
  @IsNotEmpty({ message: 'Name is required' })
  @Length(2, 255, {
    message: 'Name must contain between 2 and 255 characters',
  })
  name: string;

  @ApiProperty({ example: 'jhon@mail.com' })
  @IsEmail({}, { message: 'Email is invalid' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({ example: 'Password-1234' })
  @IsNotEmpty({ message: 'Password is required' })
  @Length(8, 255, { message: 'Password must contain at least 8 characters' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&-])[A-Za-z\d@$!%*?&-]{8,}$/,
    {
      message:
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    },
  )
  password: string;
}
