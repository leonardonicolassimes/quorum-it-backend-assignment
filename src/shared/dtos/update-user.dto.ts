/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsOptional, Length, Matches } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @Length(2, 255, {
    message: 'Name must contain between 2 and 255 characters',
  })
  name?: string;

  @IsOptional()
  @Length(8, 255, { message: 'Password must contain at least 8 characters' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&-])[A-Za-z\d@$!%*?&-]{8,}$/,
    {
      message:
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    },
  )
  password?: string;
}
