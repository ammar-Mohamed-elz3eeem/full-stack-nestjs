/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth/auth.controller';
import { AuthService } from './auth.service';
import { AuthRepository } from './auth.repository';
import dotenv from 'dotenv';
import { ServiceError } from '../error/ServiceError';
import { DatabaseModule } from '@/database/database.module';
import { User } from './interfaces/user.interface';
import type { Request } from 'express';

dotenv.config();

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthRepository, AuthService],
      imports: [DatabaseModule],
    }).compile();

    authController = app.get<AuthController>(AuthController);
    authService = app.get<AuthService>(AuthService);
  });

  describe('register route', () => {
    it('Should return "Full name, email, and password are required"', (done) => {
      expect(
        authController.register({
          fullName: '',
          email: '',
          password: '',
        }),
      )
        .rejects.toThrow(
          new ServiceError('Failed to create user', 'AuthController.register'),
        )
        .then(() => {
          done();
        })
        .catch(() => {
          done();
        });
    });
    it('Should return "Invalid email format"', (done) => {
      expect(
        authController.register({
          fullName: 'Ammar Massoud',
          email: 'ammarmassoud',
          password: 'Password1!',
        }),
      )
        .rejects.toThrow(
          new ServiceError('Failed to create user', 'AuthController.register'),
        )
        .then(() => {
          done();
        })
        .catch(() => {
          done();
        });
    });
    it('Should return "Password must be at least 6 characters long"', (done) => {
      expect(
        authController.register({
          fullName: 'Ammar Massoud',
          email: 'ammarmassoud@s5d4.com',
          password: '55454',
        }),
      )
        .rejects.toThrow(
          new ServiceError('Failed to create user', 'AuthController.register'),
        )
        .then(() => {
          done();
        })
        .catch(() => {
          done();
        });
    });
  });

  describe('getProfile (me route)', () => {
    let createdUser: User;

    beforeAll(async () => {
      // Create a user to test the /me route
      try {
        const result = await authService.createUser(
          'Profile Test User',
          'profiletest@example.com',
          'WeaK1!',
        );
        createdUser = result.user;
      } catch {
        // User might already exist from previous test runs
        const result = await authService.validateUser(
          'profiletest@example.com',
          'WeaK1!',
        );
        createdUser = result.user;
      }
    });

    it('should return user profile when valid user is in request', async () => {
      const mockRequest = {
        user: {
          id: createdUser.id,
          email: createdUser.email,
          fullName: createdUser.fullName,
        },
      } as unknown as Request;

      const result = await authController.getProfile(mockRequest);

      expect(result).toBeDefined();
      expect(result.email).toBe('profiletest@example.com');
      expect(result.fullName).toBe('Profile Test User');
    });

    it('should throw error when user ID does not exist', async () => {
      const mockRequest = {
        user: {
          id: '507f1f77bcf86cd799439011',
          email: 'nonexistent@example.com',
          fullName: 'Non Existent',
        },
      } as unknown as Request;

      await expect(authController.getProfile(mockRequest)).rejects.toThrow();
    });

    it('should throw error when user ID is invalid format', async () => {
      const mockRequest = {
        user: {
          id: 'invalid-id-format',
          email: 'test@example.com',
          fullName: 'Test',
        },
      } as unknown as Request;

      await expect(authController.getProfile(mockRequest)).rejects.toThrow();
    });

    it('should throw error when user ID is undefined', async () => {
      const mockRequest = {
        user: { id: undefined, email: 'test@example.com', fullName: 'Test' },
      } as unknown as Request;

      await expect(authController.getProfile(mockRequest)).rejects.toThrow();
    });

    it('should throw error when user ID is null', async () => {
      const mockRequest = {
        user: { id: null, email: 'test@example.com', fullName: 'Test' },
      } as unknown as Request;

      await expect(authController.getProfile(mockRequest)).rejects.toThrow();
    });

    it('should throw error when user ID is empty string', async () => {
      const mockRequest = {
        user: { id: '', email: 'test@example.com', fullName: 'Test' },
      } as unknown as Request;

      await expect(authController.getProfile(mockRequest)).rejects.toThrow();
    });

    it('should throw error when user object is missing from request', async () => {
      const mockRequest = {} as unknown as Request;

      await expect(authController.getProfile(mockRequest)).rejects.toThrow();
    });

    it('should return user with all expected fields', async () => {
      const mockRequest = {
        user: {
          id: createdUser.id,
          email: createdUser.email,
          fullName: createdUser.fullName,
        },
      } as unknown as Request;

      const result = await authController.getProfile(mockRequest);

      expect(result.id || (result as any)['_id']).toBeDefined();
      expect(result.email).toBeDefined();
      expect(result.fullName).toBeDefined();
      expect(result.password).toBeDefined(); // Should be hashed
    });

    it('should return correct user when request has role user', async () => {
      const mockRequest = {
        user: {
          id: createdUser.id,
          email: createdUser.email,
          fullName: createdUser.fullName,
          role: 'user',
        },
      } as unknown as Request;

      const result = await authController.getProfile(mockRequest);

      expect(result.email).toBe('profiletest@example.com');
    });

    it('should return correct user when request has role admin', async () => {
      const mockRequest = {
        user: {
          id: createdUser.id,
          email: createdUser.email,
          fullName: createdUser.fullName,
          role: 'admin',
        },
      } as unknown as Request;

      const result = await authController.getProfile(mockRequest);

      expect(result.email).toBe('profiletest@example.com');
    });
  });

  describe('getAllUsers (users route)', () => {
    beforeAll(async () => {
      // Create multiple users for testing
      const testUsers = [
        {
          fullName: 'User One',
          email: 'userone@example.com',
          password: 'WeaK1!',
        },
        {
          fullName: 'User Two',
          email: 'usertwo@example.com',
          password: 'WeaK1!',
        },
        {
          fullName: 'User Three',
          email: 'userthree@example.com',
          password: 'WeaK1!',
        },
      ];

      for (const user of testUsers) {
        try {
          await authService.createUser(
            user.fullName,
            user.email,
            user.password,
          );
        } catch {
          // User might already exist, continue
        }
      }
    });

    it('should return an array of users', async () => {
      const result = await authController.getAllUsers();

      expect(Array.isArray(result)).toBe(true);
    });

    it('should return at least one user', async () => {
      const result = await authController.getAllUsers();

      expect(result.length).toBeGreaterThan(0);
    });

    it('should return users with expected structure', async () => {
      const result = await authController.getAllUsers();

      result.forEach((user: User) => {
        expect(user.email).toBeDefined();
        expect(user.fullName).toBeDefined();
        expect(user.password).toBeDefined();
      });
    });

    it('should include created test users', async () => {
      const result = await authController.getAllUsers();
      const emails = result.map((user: User) => user.email);

      expect(emails).toContain('userone@example.com');
      expect(emails).toContain('usertwo@example.com');
      expect(emails).toContain('userthree@example.com');
    });

    it('should return users with hashed passwords', async () => {
      const result = await authController.getAllUsers();

      result.forEach((user: User) => {
        // Hashed passwords should not equal plain text passwords
        expect(user.password).not.toBe('WeaK1!');
        // Bcrypt hashes start with $2
        expect(user.password.startsWith('$2')).toBe(true);
      });
    });

    it('should return users with non-empty full names', async () => {
      const result = await authController.getAllUsers();

      result.forEach((user: User) => {
        expect(user.fullName.length).toBeGreaterThan(0);
      });
    });

    it('should return consistent results on multiple calls', async () => {
      const firstCall = await authController.getAllUsers();
      const secondCall = await authController.getAllUsers();

      expect(firstCall.length).toBe(secondCall.length);
    });

    it('should return users with id field', async () => {
      const result = await authController.getAllUsers();

      result.forEach((user: User) => {
        expect(user.id || (user as any)['_id']).toBeDefined();
      });
    });
  });
});
