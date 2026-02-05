# Backend Server

A robust REST API built with NestJS, featuring JWT authentication, MongoDB integration, and OpenAPI documentation.

## Table of Contents

- [Features](#feat)
- [Project Structure](#structure)
- [Tech Stack](#stack)
- [Prerequsites](#prerequsites)
- [Quick start](#quick-start)
- [Available Scripts](#scripts)
- [API Endpoints](#endpoints)
- [API Documentation](#api-docs)
- [Authentication](#auth)
- [Testing](#testing)
- [Docker](#docker)
- [Architecture](#architecture)
- [Configuration](#configuration)

## 🚀 Features <a name="feat"></a>

- **Authentication System** - JWT-based auth with login, register, and profile endpoints
- **Role-Based Access Control** - User and Admin roles with middleware protection
- **MongoDB Integration** - Mongoose ODM for database operations
- **OpenAPI/Swagger** - Auto-generated API documentation
- **Input Validation** - Zod schema validation with custom middleware
- **Error Handling** - Centralized error handling with custom error classes
- **Testing** - Unit tests and E2E tests with Jest

## 📁 Project Structure <a name="structure"></a>

```
backend/
├── src/
│   ├── auth/                    # Authentication module
│   │   ├── dto/                 # Data Transfer Objects with Swagger decorators
│   │   ├── interfaces/          # TypeScript interfaces
│   │   ├── auth.controller.ts   # Auth endpoints
│   │   ├── auth.service.ts      # Business logic
│   │   ├── auth.repository.ts   # Database operations
│   │   ├── auth.module.ts       # Module definition
│   │   └── auth.schema.ts       # Zod validation schemas
│   ├── database/                # Database configuration
│   │   ├── connection.service.ts
│   │   ├── database.module.ts
│   │   └── database.provider.ts
│   ├── error/                   # Error handling
│   │   ├── ControllerError.ts
│   │   └── ServiceError.ts
│   ├── middlewares/             # Custom middlewares
│   │   ├── AuthMiddleware.ts    # JWT authentication
│   │   ├── RequestValidator.ts  # Zod validation
│   │   └── RequestLogger.ts     # Request logging
│   ├── models/                  # Mongoose models
│   │   └── User.model.ts
│   ├── types/                   # Shared TypeScript types
│   ├── app.module.ts            # Root module
│   ├── main.ts                  # Application entry point
│   └── generate-openapi.ts      # OpenAPI spec generator
├── test/                        # E2E tests
├── Dockerfile                   # Production Docker image
└── Development.Dockerfile       # Development Docker image
```

## 🛠️ Tech Stack <a name="stack"></a>

| Technology | Purpose           |
| ---------- | ----------------- |
| NestJS     | Backend framework |
| TypeScript | Type safety       |
| MongoDB    | Database          |
| Mongoose   | ODM               |
| JWT        | Authentication    |
| Bcrypt     | Password hashing  |
| Zod        | Validation        |
| Swagger    | API documentation |
| Jest       | Testing           |

## 📋 Prerequisites <a name="prerequsites"></a>

- Node.js 20+
- pnpm 9+
- MongoDB 6+

## 🚀 Quick Start <a name="quick-start"></a>

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Configure Environment

Create a `.env` file in the backend directory:

```env
# Server
PORT=5000
FRONTEND_URL=http://localhost:5173

# Database
DB_CONNECTION_STRING=mongodb://admin:admin@localhost:27017/myapp?authSource=admin

# Security
PASSWORD_SALT=your-secure-password-salt
JWT_SECRET=your-secure-jwt-secret
JWT_EXPIRES_IN=1h
```

### 3. Start Development Server

```bash
# Watch mode with hot reload
pnpm start:dev

# Or standard start
pnpm start
```

The server will be available at `http://localhost:5000`

## 📜 Available Scripts <a name="scripts"></a>

| Script                  | Description               |
| ----------------------- | ------------------------- |
| `pnpm start`            | Start the server          |
| `pnpm start:dev`        | Start with watch mode     |
| `pnpm start:debug`      | Start with debugger       |
| `pnpm start:prod`       | Start production build    |
| `pnpm build`            | Build for production      |
| `pnpm test`             | Run unit tests            |
| `pnpm test:watch`       | Run tests in watch mode   |
| `pnpm test:cov`         | Run tests with coverage   |
| `pnpm test:e2e`         | Run E2E tests             |
| `pnpm lint`             | Lint and fix code         |
| `pnpm format`           | Format code with Prettier |
| `pnpm generate:openapi` | Generate OpenAPI spec     |

## 🔌 API Endpoints <a name="endpoints"></a>

### Public Endpoints

| Method | Endpoint         | Description       |
| ------ | ---------------- | ----------------- |
| GET    | `/`              | Health check      |
| POST   | `/auth/login`    | User login        |
| POST   | `/auth/register` | User registration |

### Protected Endpoints (Require JWT)

| Method | Endpoint      | Description              | Role  |
| ------ | ------------- | ------------------------ | ----- |
| GET    | `/auth/me`    | Get current user profile | Any   |
| GET    | `/auth/users` | Get all users            | Admin |

## 📖 API Documentation <a name="api-docs"></a>

When running in development, Swagger UI is available at:

```
http://localhost:5000/api-docs
```

### Generate OpenAPI Spec

```bash
pnpm generate:openapi
```

This generates `openapi.json` in the backend root directory.

## 🔒 Authentication <a name="auth"></a>

The API uses JWT (JSON Web Token) for authentication.

### Login Flow

1. POST `/auth/login` with email and password
2. Receive JWT token in response
3. Include token in subsequent requests:

```
Authorization: Bearer <your-jwt-token>
```

### Password Requirements

- 6-15 characters
- At least one uppercase letter (A-Z)
- At least one lowercase letter (a-z)
- At least one number (0-9)
- At least one special character (!@#$%^&\*)

## 🧪 Testing <a name="testing"></a>

### Run Unit Tests

```bash
pnpm test
```

### Run E2E Tests

```bash
# Ensure MongoDB is running
pnpm test:e2e
```

### Test Coverage

```bash
pnpm test:cov
```

## 🐳 Docker <a name="docker"></a>

### Development

```bash
# From project root
docker compose -f docker-compose.dev.yml up backend-dev
```

### Production

```bash
# Build image
docker build -t backend:latest .

# Run container
docker run -p 5000:5000 --env-file .env backend:latest
```

## 🏗️ Architecture <a name="architecture"></a>

### Request Flow

```
Request → Middleware → Controller → Service → Repository → Database
                ↓
            Validation
            Auth Check
            Logging
```

### Error Handling

```typescript
// Service errors
throw new ServiceError('User not found', 'AuthService.getUserById');

// Controller automatically wraps errors
throw ControllerError.fromError(error);
```

### Middleware Stack

1. **RequestLogger** - Logs incoming requests
2. **RequestValidator** - Validates request body with Zod
3. **AuthMiddleware** - Validates JWT tokens
   - `optionalAuth()` - Auth optional
   - `requiredAuth()` - Auth required
   - `requiredSuperAuth()` - Admin required

## 🔧 Configuration <a name="configuration"></a>

### Environment Variables

| Variable               | Description               | Default |
| ---------------------- | ------------------------- | ------- |
| `PORT`                 | Server port               | 5000    |
| `FRONTEND_URL`         | Frontend URL for CORS     | -       |
| `DB_CONNECTION_STRING` | MongoDB connection string | -       |
| `PASSWORD_SALT`        | Salt for password hashing | -       |
| `JWT_SECRET`           | Secret for JWT signing    | -       |
| `JWT_EXPIRES_IN`       | JWT expiration time       | 1h      |
