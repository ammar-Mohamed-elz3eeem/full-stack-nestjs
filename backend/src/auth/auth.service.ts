import { Inject, Injectable } from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import { User } from './interfaces/user.interface';
import { ServiceError } from '../error/ServiceError';
import bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(
    @Inject(AuthRepository) private readonly authRepository: AuthRepository,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<{ user: User; token: string }> {
    const user = await this.authRepository.getByEmail(email);
    if (!user) {
      throw new ServiceError('User not found', 'AuthService.validateUser');
    }

    const passwordMatch = await bcrypt.compare(
      password + process.env.PASSWORD_SALT,
      user.password,
    );
    if (!passwordMatch) {
      throw new ServiceError('Invalid password', 'AuthService.validateUser');
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        fullName: user.fullName,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1h' } as jwt.SignOptions,
    );

    return {
      user,
      token,
    };
  }

  async createUser(
    fullName: string,
    email: string,
    password: string,
  ): Promise<{ user: User; token: string }> {
    const existingUser = await this.authRepository.getByEmail(email);
    if (existingUser) {
      throw new ServiceError('Email already in use', 'AuthService.createUser');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(
      password + process.env.PASSWORD_SALT,
      salt,
    );

    const newUser: User = {
      fullName,
      email,
      password: hashedPassword,
    };

    const user = await this.authRepository.create(newUser);
    if (!user) {
      throw new ServiceError('Failed to create user', 'AuthService.createUser');
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        fullName: user.fullName,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1h' } as jwt.SignOptions,
    );

    return {
      user,
      token,
    };
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.authRepository.getById(id);
    if (!user) {
      throw new ServiceError('User not found', 'AuthService.getUserById');
    }
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return await this.authRepository.getAll();
  }
}
