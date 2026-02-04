import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiPropertyOptional({
    description: 'Unique identifier of the user',
    example: '507f1f77bcf86cd799439011',
  })
  id?: string;

  @ApiProperty({
    description: 'Full name of the user',
    example: 'John Doe',
  })
  fullName: string;

  @ApiProperty({
    description: 'Email address of the user',
    example: 'john.doe@example.com',
  })
  email: string;

  @ApiPropertyOptional({
    description: 'Role of the user',
    example: 'user',
    enum: ['user', 'admin'],
  })
  role?: 'user' | 'admin';
}

export class AuthResponseDto {
  @ApiProperty({
    description: 'Response message',
    example: 'Welcome back, John Doe!',
  })
  message: string;

  @ApiProperty({
    description: 'User details',
    type: UserResponseDto,
  })
  user: UserResponseDto;

  @ApiProperty({
    description: 'JWT authentication token',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjUwN2YxZjc3YmNmODZjZDc5OTQzOTAxMSIsImVtYWlsIjoiam9obi5kb2VAZXhhbXBsZS5jb20iLCJpYXQiOjE2MjE1MjU2OTIsImV4cCI6MTYyMTUyOTI5Mn0.abc123',
  })
  token: string;
}

export class ErrorResponseDto {
  @ApiProperty({
    description: 'Error message',
    example: 'Invalid password',
  })
  message: string;

  @ApiPropertyOptional({
    description: 'Array of validation errors',
    example: ['Password must contain at least one uppercase letter'],
    type: [String],
  })
  errors?: string[];
}
