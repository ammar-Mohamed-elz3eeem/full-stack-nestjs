import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'Full name of the user',
    example: 'John Doe',
    minLength: 1,
  })
  fullName: string;

  @ApiProperty({
    description: 'Email address of the user',
    example: 'john.doe@example.com',
    format: 'email',
  })
  email: string;

  @ApiProperty({
    description:
      'Password must be 6-15 characters with uppercase, lowercase, number, and special character',
    example: 'Password1!',
    minLength: 6,
    maxLength: 15,
  })
  password: string;
}
