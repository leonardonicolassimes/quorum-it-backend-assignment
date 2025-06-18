import { ApiProperty } from '@nestjs/swagger';
import { ResponseUserDto } from './response-user.dto';

export class TokenResponseDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT access token',
  })
  access_token: string;

  @ApiProperty({ type: ResponseUserDto })
  user: ResponseUserDto;
}
