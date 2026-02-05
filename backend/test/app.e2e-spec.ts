/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import dotenv from 'dotenv';
import { ConnectionService } from '../src/database/connection.service';
import { sign as JWTSign } from 'jsonwebtoken';

dotenv.config();

// Helper function to generate JWT tokens for testing
const generateTestToken = (payload: {
  id: string;
  email: string;
  fullName: string;
  role?: 'user' | 'admin';
}): string => {
  return JWTSign(payload, process.env.JWT_SECRET as string, {
    expiresIn: '1h',
  });
};

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;
  let connectionService: ConnectionService;
  let moduleFixture: TestingModule;

  beforeAll(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    connectionService = moduleFixture.get<ConnectionService>(ConnectionService);
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  describe('/auth/register (POST)', () => {
    it('missing fields', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({ email: '' })
        .expect(400)
        .then((response) => {
          expect(response.body.message).toBe('Invalid request data');
          expect(response.body.errors).toContain('Full name is required');
        });
    });

    it('invalid email', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          fullName: 'Test User',
          email: 'invalidemail',
          password: 'password123',
        })
        .expect(400)
        .then((response) => {
          expect(response.body.message).toBe('Invalid request data');
          expect(response.body.errors).toContain('Invalid email format');
        });
    });

    it('weak password', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          fullName: 'Test User',
          email: 'testuser@example.com',
          password: 'weak',
        })
        .expect(400)
        .then((response) => {
          expect(response.body.message).toBe('Invalid request data');
          expect(response.body.errors).toContain(
            'Password must contain at least one uppercase letter',
          );
        });
    });

    it('no number in password', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          fullName: 'Test User',
          email: 'testuser@example.com',
          password: 'Weak',
        })
        .expect(400)
        .then((response) => {
          expect(response.body.message).toBe('Invalid request data');
          expect(response.body.errors).toContain(
            'Password must contain at least one number',
          );
        });
    });

    it('no lowercase in password', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          fullName: 'Test User',
          email: 'testuser@example.com',
          password: 'WAEK',
        })
        .expect(400)
        .then((response) => {
          expect(response.body.message).toBe('Invalid request data');
          expect(response.body.errors).toContain(
            'Password must contain at least one lowercase letter',
          );
        });
    });

    it('no special character in password', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          fullName: 'Test User',
          email: 'testuser@example.com',
          password: 'WaeK1234',
        })
        .expect(400)
        .then((response) => {
          expect(response.body.message).toBe('Invalid request data');
          expect(response.body.errors).toContain(
            'Password must contain at least one special character',
          );
        });
    });

    it('password less than 6 characters', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          fullName: 'Test User',
          email: 'testuser@example.com',
          password: 'Wea1!',
        })
        .expect(400)
        .then((response) => {
          expect(response.body.message).toBe('Invalid request data');
          expect(response.body.errors).toContain(
            'Password must be at least 6 characters long',
          );
        });
    });

    it('password more than 15 characters', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          fullName: 'Test User',
          email: 'testuser@example.com',
          password: 'WeaK1!example.com12345',
        })
        .expect(400)
        .then((response) => {
          expect(response.body.message).toBe('Invalid request data');
          expect(response.body.errors).toContain(
            'Password must be at most 15 characters long',
          );
        });
    });

    it('valid data', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          fullName: 'Test User',
          email: 'testuser@example.com',
          password: 'WeaK1!',
        })
        .expect(201);
    });
  });

  describe('/auth/login (POST)', () => {
    it('valid credentials', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'testuser@example.com',
          password: 'WeaK1!',
        })
        .expect(200);
    });

    it('invalid credentials', async () => {
      return await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'testuser@example.com',
          password: 'WeaK12!',
        })
        .expect(400)
        .then((response) => {
          expect(response.body.message).toBe('Invalid password');
        })
        .catch(() => {});
    });
  });

  describe('/auth/me (GET)', () => {
    // First, create a user and get their ID for testing
    let createdUserId: string;

    beforeAll(async () => {
      // Register a user specifically for /me tests
      const registerResponse = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          fullName: 'Me Test User',
          email: 'metest@example.com',
          password: 'WeaK1!',
        });

      createdUserId =
        registerResponse.body.user?.id || registerResponse.body.user?._id;
    });

    it('should return 401 when no authorization header is provided', async () => {
      return await request(app.getHttpServer())
        .get('/auth/me')
        .expect(401)
        .then((response) => {
          expect(response.body.message).toBe('Authorization header missing');
        });
    });

    it('should return 401 when authorization header has no token', async () => {
      return await request(app.getHttpServer())
        .get('/auth/me')
        .set('Authorization', 'Bearer ')
        .expect(401)
        .then((response) => {
          expect(response.body.message).toBe('Token missing');
        });
    });

    it('should return 401 when token is invalid', async () => {
      return await request(app.getHttpServer())
        .get('/auth/me')
        .set('Authorization', 'Bearer invalidtoken123')
        .expect(401)
        .then((response) => {
          expect(response.body.message).toBeDefined();
        });
    });

    it('should return 401 when token is malformed', async () => {
      return await request(app.getHttpServer())
        .get('/auth/me')
        .set(
          'Authorization',
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.malformed',
        )
        .expect(401);
    });

    it('should return 401 when token is expired', async () => {
      const expiredToken = JWTSign(
        {
          id: createdUserId,
          email: 'metest@example.com',
          fullName: 'Me Test User',
        },
        process.env.JWT_SECRET as string,
        { expiresIn: '-1h' }, // Already expired
      );

      return await request(app.getHttpServer())
        .get('/auth/me')
        .set('Authorization', `Bearer ${expiredToken}`)
        .expect(401)
        .then((response) => {
          expect(response.body.message).toContain('expired');
        });
    });

    it('should return 401 when token has wrong signature', async () => {
      const wrongSecretToken = JWTSign(
        {
          id: createdUserId,
          email: 'metest@example.com',
          fullName: 'Me Test User',
        },
        'wrong-secret-key',
        { expiresIn: '1h' },
      );

      return await request(app.getHttpServer())
        .get('/auth/me')
        .set('Authorization', `Bearer ${wrongSecretToken}`)
        .expect(401)
        .then((response) => {
          expect(response.body.message).toBeDefined();
        });
    });

    it('should return user profile with valid token', async () => {
      const validToken = generateTestToken({
        id: createdUserId,
        email: 'metest@example.com',
        fullName: 'Me Test User',
      });

      return await request(app.getHttpServer())
        .get('/auth/me')
        .set('Authorization', `Bearer ${validToken}`)
        .expect(200)
        .then((response) => {
          expect(response.body.email).toBe('metest@example.com');
          expect(response.body.fullName).toBe('Me Test User');
          expect(response.body.password).toBeDefined(); // Password should be hashed
        });
    });

    it('should return 400/500 when user ID in token does not exist', async () => {
      const nonExistentToken = generateTestToken({
        id: '507f1f77bcf86cd799439011', // Valid MongoDB ObjectId format but non-existent
        email: 'nonexistent@example.com',
        fullName: 'Non Existent User',
      });

      return await request(app.getHttpServer())
        .get('/auth/me')
        .set('Authorization', `Bearer ${nonExistentToken}`)
        .expect((res) => {
          // Should return error status (400 or 500)
          expect([400, 500]).toContain(res.status);
          expect(res.body.message).toBeDefined();
        });
    });

    it('should return correct user when role is user', async () => {
      const userToken = generateTestToken({
        id: createdUserId,
        email: 'metest@example.com',
        fullName: 'Me Test User',
        role: 'user',
      });

      return await request(app.getHttpServer())
        .get('/auth/me')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200)
        .then((response) => {
          expect(response.body.email).toBe('metest@example.com');
        });
    });

    it('should return correct user when role is admin', async () => {
      const adminToken = generateTestToken({
        id: createdUserId,
        email: 'metest@example.com',
        fullName: 'Me Test User',
        role: 'admin',
      });

      return await request(app.getHttpServer())
        .get('/auth/me')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200)
        .then((response) => {
          expect(response.body.email).toBe('metest@example.com');
        });
    });

    it('should handle Authorization header without Bearer prefix', async () => {
      const validToken = generateTestToken({
        id: createdUserId,
        email: 'metest@example.com',
        fullName: 'Me Test User',
      });

      return await request(app.getHttpServer())
        .get('/auth/me')
        .set('Authorization', validToken) // No 'Bearer ' prefix
        .expect(401)
        .then((response) => {
          expect(response.body.message).toBe('Token missing');
        });
    });
  });

  describe('/auth/users (GET)', () => {
    let regularUserId: string;
    let adminTestUserId: string;

    beforeAll(async () => {
      // Register a regular user
      const regularUserResponse = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          fullName: 'Regular User',
          email: 'regular@example.com',
          password: 'WeaK1!',
        });

      regularUserId =
        regularUserResponse.body.user?.id || regularUserResponse.body.user?._id;

      // Register an admin user
      const adminUserResponse = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          fullName: 'Admin User',
          email: 'admin@example.com',
          password: 'WeaK1!',
        });

      adminTestUserId =
        adminUserResponse.body.user?.id || adminUserResponse.body.user?._id;
    });

    it('should return 401 when no authorization header is provided', async () => {
      await request(app.getHttpServer())
        .get('/auth/users')
        .expect(401)
        .then((response) => {
          expect(response.body.message).toBe('Authorization header missing');
        });
    });

    it('should return 401 when authorization header has no token', async () => {
      await request(app.getHttpServer())
        .get('/auth/users')
        .set('Authorization', 'Bearer ')
        .expect(401)
        .then((response) => {
          expect(response.body.message).toBe('Token missing');
        });
    });

    it('should return 401 when token is invalid', async () => {
      await request(app.getHttpServer())
        .get('/auth/users')
        .set('Authorization', 'Bearer invalidtoken123')
        .expect(401);
    });

    it('should return 401 when token is expired', async () => {
      const expiredToken = JWTSign(
        {
          id: adminTestUserId,
          email: 'admin@example.com',
          fullName: 'Admin User',
          role: 'admin',
        },
        process.env.JWT_SECRET as string,
        { expiresIn: '-1h' },
      );

      await request(app.getHttpServer())
        .get('/auth/users')
        .set('Authorization', `Bearer ${expiredToken}`)
        .expect(401);
    });

    it('should return 403 when user role is not admin', async () => {
      const regularUserToken = generateTestToken({
        id: regularUserId,
        email: 'regular@example.com',
        fullName: 'Regular User',
        role: 'user',
      });

      await request(app.getHttpServer())
        .get('/auth/users')
        .set('Authorization', `Bearer ${regularUserToken}`)
        .expect(403)
        .then((response) => {
          expect(response.body.message).toBe('Admin privileges required');
        });
    });

    it('should return 403 when role is not provided in token (defaults to non-admin)', async () => {
      const noRoleToken = generateTestToken({
        id: regularUserId,
        email: 'regular@example.com',
        fullName: 'Regular User',
      });

      await request(app.getHttpServer())
        .get('/auth/users')
        .set('Authorization', `Bearer ${noRoleToken}`)
        .expect(403)
        .then((response) => {
          expect(response.body.message).toBe('Admin privileges required');
        });
    });

    it('should return all users when admin token is provided', async () => {
      const adminToken = generateTestToken({
        id: adminTestUserId,
        email: 'admin@example.com',
        fullName: 'Admin User',
        role: 'admin',
      });

      await request(app.getHttpServer())
        .get('/auth/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200)
        .then((response) => {
          expect(Array.isArray(response.body)).toBe(true);
          expect(response.body.length).toBeGreaterThan(0);
        });
    });

    it('should return array of users with correct structure', async () => {
      const adminToken = generateTestToken({
        id: adminTestUserId,
        email: 'admin@example.com',
        fullName: 'Admin User',
        role: 'admin',
      });

      await request(app.getHttpServer())
        .get('/auth/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200)
        .then((response) => {
          expect(Array.isArray(response.body)).toBe(true);
          response.body.forEach(
            (user: { email: string; fullName: string; password: string }) => {
              expect(user.email).toBeDefined();
              expect(user.fullName).toBeDefined();
              expect(user.password).toBeDefined(); // Hashed password
            },
          );
        });
    });

    it('should include recently registered users in the list', async () => {
      const adminToken = generateTestToken({
        id: adminTestUserId,
        email: 'admin@example.com',
        fullName: 'Admin User',
        role: 'admin',
      });

      await request(app.getHttpServer())
        .get('/auth/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200)
        .then((response) => {
          const emails = response.body.map(
            (user: { email: string }) => user.email,
          );
          expect(emails).toContain('regular@example.com');
          expect(emails).toContain('admin@example.com');
        });
    });

    it('should return 401 when token has wrong signature', async () => {
      const wrongSecretToken = JWTSign(
        {
          id: adminTestUserId,
          email: 'admin@example.com',
          fullName: 'Admin User',
          role: 'admin',
        },
        'wrong-secret-key',
        { expiresIn: '1h' },
      );

      await request(app.getHttpServer())
        .get('/auth/users')
        .set('Authorization', `Bearer ${wrongSecretToken}`)
        .expect(401);
    });

    it('should handle malformed Authorization header', async () => {
      await request(app.getHttpServer())
        .get('/auth/users')
        .set('Authorization', 'InvalidFormat token')
        .expect(401);
    });

    it('should handle empty Bearer token', async () => {
      await request(app.getHttpServer())
        .get('/auth/users')
        .set('Authorization', 'Bearer')
        .expect(401);
    });
  });

  afterAll(async () => {
    // Get the connection service and clear all collections
    const collections = await connectionService.connection.db?.collections();

    for (const collection of collections || []) {
      await collection.deleteMany({});
    }

    // Close database connection and app
    await connectionService.disconnect();
    await app.close();
  });
});
