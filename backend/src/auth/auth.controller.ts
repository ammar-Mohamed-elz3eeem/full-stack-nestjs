import {
  Body,
  Controller,
  Get,
  HttpCode,
  Inject,
  Post,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import type { LoginUserDTO, CreateUserDTO } from './auth.schema';
import { User } from './interfaces/user.interface';
import { ControllerError } from '@/error/ControllerError';
import type { Request } from 'express';
import {
  CreateUserDto,
  LoginUserDto,
  AuthResponseDto,
  UserResponseDto,
  ErrorResponseDto,
} from './dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(@Inject(AuthService) private readonly authService: AuthService) {}

  @HttpCode(200)
  @Post('login')
  @ApiOperation({
    summary: 'User login',
    description: 'Authenticate a user with email and password',
  })
  @ApiBody({ type: LoginUserDto })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid credentials or validation error',
    type: ErrorResponseDto,
  })
  public async login(
    @Body() loginDto: LoginUserDTO,
  ): Promise<{ message: string; user: User; token: string }> {
    try {
      const { user, token } = await this.authService.validateUser(
        loginDto.email,
        loginDto.password,
      );

      return {
        message: `Welcome back, ${user.fullName}!`,
        user,
        token,
      };
    } catch (error) {
      throw ControllerError.fromError(error as Error);
    }
  }

  @Post('register')
  @ApiOperation({
    summary: 'User registration',
    description: 'Register a new user account',
  })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error or email already in use',
    type: ErrorResponseDto,
  })
  public async register(
    @Body() createUserDto: CreateUserDTO,
  ): Promise<{ message: string; user: User; token: string }> {
    try {
      const { user, token } = await this.authService.createUser(
        createUserDto.fullName,
        createUserDto.email,
        createUserDto.password,
      );

      return {
        message: `User ${user.fullName} registered successfully`,
        user,
        token,
      };
    } catch (error) {
      throw ControllerError.fromError(error as Error);
    }
  }

  @Get('me')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Get current user profile',
    description: 'Returns the authenticated user profile',
  })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
    type: ErrorResponseDto,
  })
  public async getProfile(@Req() req: Request): Promise<User> {
    try {
      const user = req.user as User;
      return await this.authService.getUserById(user.id as string);
    } catch (error) {
      throw ControllerError.fromError(error as Error);
    }
  }

  @Get('users')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Get all users',
    description: 'Returns a list of all users (admin only)',
  })
  @ApiResponse({
    status: 200,
    description: 'List of users retrieved successfully',
    type: [UserResponseDto],
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin privileges required',
    type: ErrorResponseDto,
  })
  public async getAllUsers(): Promise<User[]> {
    try {
      return await this.authService.getAllUsers();
    } catch (error) {
      throw ControllerError.fromError(error as Error);
    }
  }
}
