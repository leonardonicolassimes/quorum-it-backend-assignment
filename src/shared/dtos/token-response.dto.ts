/* eslint-disable @typescript-eslint/no-unsafe-call */
import { ApiProperty } from '@nestjs/swagger';
import { ResponseUserDto } from './response-user.dto';
import { Expose } from 'class-transformer';

export class TokenResponseDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT access token',
  })
  @Expose()
  access_token: string;

  @ApiProperty({ type: ResponseUserDto })
  @Expose()
  user: ResponseUserDto;
}
