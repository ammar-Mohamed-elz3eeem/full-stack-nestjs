# Full Stack Application

A modern full-stack application featuring a React frontend, NestJS backend, and Mintlify documentation server, all containerized with Docker.

## 📑 Table of Contents

- [Architecture](#️-architecture)
- [Quick Start](#-quick-start)
- [Project Structure](#-project-structure)
- [Docker Services](#-docker-services)
- [Environment Variables](#️-environment-variables)
- [Docker Commands](#-docker-commands)
- [Local Development](#-local-development-without-docker)
- [Testing](#-testing)
- [API Documentation](#-api-documentation)
- [Deployment](#-deployment)
- [Service Documentation](#-service-documentation)
- [Tech Stack](#️-tech-stack)
- [License](#-license)

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                           Docker Network                     │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│   ┌──────────────┐    ┌──────────────┐    ┌──────────────┐   │
│   │   Frontend   │    │   Backend    │    │     Docs     │   │
│   │    (React)   │──▶│   (NestJS)   │    │  (Mintlify)  │   │
│   │  Port: 5173  │    │  Port: 5000  │    │  Port: 3000  │   │
│   │    / 80      │    │              │    │              │   │
│   └──────────────┘    └──────┬───────┘    └──────────────┘   │
│                              │                               │
│                              ▼                               │
│                       ┌──────────────┐                       │
│                       │   MongoDB    │                       │
│                       │ Port: 27017  │                       │
│                       └──────────────┘                       │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) (v20+)
- [Docker Compose](https://docs.docker.com/compose/install/) (v2+)

### Development

Start all services in development mode with hot-reloading:

```bash
docker compose -f docker-compose.dev.yml up --build
```

Access the services:

| Service       | URL                            | Description       |
| ------------- | ------------------------------ | ----------------- |
| Frontend      | http://localhost:5173          | React application |
| Backend       | http://localhost:5000          | NestJS API        |
| API Docs      | http://localhost:5000/api-docs | Swagger UI        |
| Documentation | http://localhost:3000          | Mintlify docs     |
| MongoDB       | localhost:27017                | Database          |

### Production

Deploy all services in production mode:

```bash
docker compose -f docker-compose.prod.yml up --build -d
```

Access the services:

| Service       | URL                            | Description               |
| ------------- | ------------------------------ | ------------------------- |
| Frontend      | http://localhost:80            | React application (Nginx) |
| Backend       | http://localhost:5000          | NestJS API                |
| API Docs      | http://localhost:5000/api-docs | Swagger UI                |
| Documentation | http://localhost:3000          | Mintlify docs             |
| MongoDB       | localhost:27017                | Database                  |

## 📁 Project Structure

```
full-stack-test/
├── backend/                    # NestJS backend server
│   ├── src/
│   │   ├── auth/              # Authentication module
│   │   ├── database/          # Database configuration
│   │   ├── error/             # Error handling
│   │   └── middlewares/       # Express middlewares
│   ├── test/                  # E2E tests
│   ├── Dockerfile             # Production image
│   └── Development.Dockerfile # Development image
│
├── frontend/                   # React frontend application
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/             # Page components
│   │   ├── hooks/             # Custom React hooks
│   │   ├── context/           # React context providers
│   │   └── lib/               # Utilities
│   ├── Dockerfile             # Production image (Nginx)
│   └── Development.Dockerfile # Development image
│
├── docs/                       # Mintlify documentation
│   ├── api-reference/         # API endpoint docs
│   ├── mint.json              # Mintlify config
│   ├── openapi.json           # OpenAPI specification
│   └── Dockerfile             # Docker image
│
├── db-data/                    # MongoDB data (gitignored)
├── docker-compose.dev.yml      # Development compose
├── docker-compose.prod.yml     # Production compose
└── README.md                   # This file
```

## 🐳 Docker Services

### Development Stack

| Service      | Container Name  | Port  | Description              |
| ------------ | --------------- | ----- | ------------------------ |
| frontend-dev | eg-frontend-dev | 5173  | Vite dev server with HMR |
| backend-dev  | eg-backend-dev  | 5000  | NestJS with hot-reload   |
| docs-dev     | eg-docs-dev     | 3000  | Mintlify dev server      |
| db-dev       | eg-db-dev       | 27017 | MongoDB database         |

### Production Stack

| Service       | Container Name   | Port  | Description         |
| ------------- | ---------------- | ----- | ------------------- |
| frontend-prod | eg-frontend-prod | 80    | Nginx static server |
| backend-prod  | eg-backend-prod  | 5000  | NestJS production   |
| docs-prod     | eg-docs-prod     | 3000  | Mintlify production |
| db-prod       | eg-db-prod       | 27017 | MongoDB database    |

## ⚙️ Environment Variables

### Backend

| Variable               | Description               | Default  |
| ---------------------- | ------------------------- | -------- |
| `PORT`                 | Server port               | `5000`   |
| `FRONTEND_URL`         | Frontend URL for CORS     | Required |
| `DOCS_URL`             | Docs URL for CORS         | Required |
| `DB_CONNECTION_STRING` | MongoDB connection URI    | Required |
| `PASSWORD_SALT`        | Salt for password hashing | Required |
| `JWT_SECRET`           | Secret for JWT signing    | Required |
| `JWT_EXPIRES_IN`       | JWT expiration time       | `1h`     |

### Frontend

| Variable           | Description     | Default  |
| ------------------ | --------------- | -------- |
| `VITE_BACKEND_URL` | Backend API URL | Required |

### Database

| Variable                     | Description           | Default |
| ---------------------------- | --------------------- | ------- |
| `MONGO_INITDB_ROOT_USERNAME` | MongoDB root username | `admin` |
| `MONGO_INITDB_ROOT_PASSWORD` | MongoDB root password | `admin` |

## 📝 Docker Commands

### Start Services

```bash
# Development (with logs)
docker compose -f docker-compose.dev.yml up --build

# Development (detached)
docker compose -f docker-compose.dev.yml up --build -d

# Production (detached)
docker compose -f docker-compose.prod.yml up --build -d
```

### Stop Services

```bash
# Development
docker compose -f docker-compose.dev.yml down

# Production
docker compose -f docker-compose.prod.yml down

# Remove volumes (⚠️ deletes data)
docker compose -f docker-compose.dev.yml down -v
```

### View Logs

```bash
# All services
docker compose -f docker-compose.dev.yml logs -f

# Specific service
docker compose -f docker-compose.dev.yml logs -f backend-dev
```

### Restart Services

```bash
# Single service
docker compose -f docker-compose.dev.yml restart backend-dev

# All services
docker compose -f docker-compose.dev.yml restart
```

### Execute Commands in Container

```bash
# Backend shell
docker exec -it eg-backend-dev sh

# Run tests
docker exec -it eg-backend-dev pnpm test

# MongoDB shell
docker exec -it eg-db-dev mongosh -u admin -p admin
```

## 🔧 Local Development (Without Docker)

### Prerequisites

- Node.js 20+
- pnpm
- MongoDB

### Backend

```bash
cd backend
pnpm install
pnpm start:dev
```

### Frontend

```bash
cd frontend
pnpm install
pnpm dev
```

### Docs

```bash
cd docs
npm install -g mintlify
mintlify dev
```

## 🧪 Testing

### Backend Tests

```bash
# Unit tests
cd backend && pnpm test

# E2E tests
cd backend && pnpm test:e2e

# Coverage
cd backend && pnpm test:cov

# Via Docker
docker exec -it eg-backend-dev pnpm test
```

## 📖 API Documentation

### Swagger UI

Available at `http://localhost:5000/api-docs` when the backend is running.

### Mintlify Docs

Available at `http://localhost:3000` when the docs service is running.

### OpenAPI Spec

Generate the latest OpenAPI specification:

```bash
cd backend && pnpm generate:openapi
```

## 🚢 Deployment

### Using Docker Compose

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd full-stack-test
   ```

2. Create environment file (optional):

   ```bash
   cp .env.example .env
   ```

3. Deploy:
   ```bash
   docker compose -f docker-compose.prod.yml up --build -d
   ```

### Production Considerations

1. **Security**
   - Change default MongoDB credentials
   - Use strong JWT secret
   - Enable HTTPS with reverse proxy

2. **Database**
   - Use external MongoDB service (Atlas, etc.)
   - Set up backup strategy
   - Configure replica sets for HA

3. **Reverse Proxy**
   - Use Nginx/Traefik for SSL termination
   - Configure proper headers
   - Set up rate limiting

4. **Monitoring**
   - Add health check endpoints
   - Configure logging aggregation
   - Set up alerting

### Example Nginx Reverse Proxy

```nginx
server {
    listen 443 ssl;
    server_name api.example.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

server {
    listen 443 ssl;
    server_name app.example.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://localhost:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

server {
    listen 443 ssl;
    server_name docs.example.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 📚 Service Documentation

For detailed documentation on each service, see:

- [Backend README](./backend/README.md) - NestJS API server
- [Frontend README](./frontend/README.md) - React application
- [Docs README](./docs/README.md) - Mintlify documentation

## 🛠️ Tech Stack

### Backend

- **Framework**: NestJS 11
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT, Bcrypt
- **Validation**: Zod
- **Documentation**: Swagger/OpenAPI

### Frontend

- **Framework**: React 19
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State**: TanStack Query
- **Routing**: React Router v7
- **UI Components**: Radix UI

### Documentation

- **Platform**: Mintlify
- **Format**: MDX
- **API Spec**: OpenAPI 3.0

### DevOps

- **Containerization**: Docker
- **Orchestration**: Docker Compose
- **CI/CD**: GitHub Actions
