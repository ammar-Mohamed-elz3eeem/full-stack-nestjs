# Documentation Server

Beautiful API documentation powered by Mintlify, with OpenAPI integration for auto-generated endpoint references.

## 📑 Table of Contents

- [Features](#-features)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Quick Start](#-quick-start)
- [Available Commands](#-available-commands)
- [Documentation Structure](#-documentation-structure)
- [Configuration](#️-configuration)
- [Customization](#-customization)
- [Writing Documentation](#-writing-documentation)
- [Docker](#-docker)
- [Syncing with Backend](#-syncing-with-backend)
- [Deployment](#-deployment)
- [Resources](#-resources)

## 🚀 Features

- **Mintlify Framework** - Modern documentation platform
- **OpenAPI Integration** - Auto-generated API reference from OpenAPI spec
- **Dark/Light Mode** - Automatic theme switching
- **Search** - Built-in documentation search
- **Responsive** - Mobile-friendly design
- **Code Examples** - Multi-language request examples

## 📁 Project Structure

```
docs/
├── api-reference/               # API reference section
│   ├── introduction.mdx         # API overview
│   └── endpoint/                # Individual endpoints (auto-generated)
│       ├── health-check.mdx
│       ├── login.mdx
│       ├── register.mdx
│       ├── get-profile.mdx
│       └── get-all-users.mdx
├── logo/                        # Logo assets
│   ├── dark.svg
│   └── light.svg
├── authentication.mdx           # Authentication guide
├── introduction.mdx             # Landing page
├── quickstart.mdx              # Getting started guide
├── mint.json                    # Mintlify configuration
├── openapi.json                 # OpenAPI specification
├── favicon.svg                  # Favicon
└── Dockerfile                   # Docker image
```

## 📋 Prerequisites

- Node.js 18+
- npm or pnpm

## 🚀 Quick Start

### 1. Install Mintlify CLI

```bash
npm install -g mintlify
```

### 2. Start Development Server

```bash
mintlify dev
```

The docs will be available at `http://localhost:3000`

## 📜 Available Commands

| Command                 | Description              |
| ----------------------- | ------------------------ |
| `mintlify dev`          | Start development server |
| `mintlify build`        | Build for production     |
| `mintlify broken-links` | Check for broken links   |

## 📖 Documentation Structure

### Pages

| Page                 | Description                |
| -------------------- | -------------------------- |
| `introduction.mdx`   | Welcome page with overview |
| `quickstart.mdx`     | Getting started guide      |
| `authentication.mdx` | JWT authentication guide   |
| `api-reference`      | API overview               |

### API Reference

Endpoint documentation is generated from `openapi.json`. Each endpoint file references the OpenAPI spec:

````mdx
---
title: "Login"
openapi: "POST /auth/login"
---

<RequestExample>
```bash cURL
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "Password1!"}'
````

</RequestExample>
```

## ⚙️ Configuration

### docs.json

The main configuration file for Mintlify:

```json
{
  "$schema": "https://mintlify.com/schema.json",
  "name": "Full Stack Test API Documentation",
  "logo": {
    "dark": "/logo/dark.svg",
    "light": "/logo/light.svg"
  },
  "colors": {
    "primary": "#0D9373",
    "light": "#07C983",
    "dark": "#0D9373"
  },
  "navigation": [
    {
      "group": "Get Started",
      "pages": ["introduction", "quickstart", "authentication"]
    },
    {
      "group": "API Documentation",
      "pages": ["api-reference/introduction"]
    }
  ],
  "openapi": ["/openapi.json"]
}
```

### OpenAPI Integration

The docs use the OpenAPI spec for:

- Automatic endpoint documentation
- Request/response schemas
- Parameter descriptions
- Authentication requirements

To update the API reference:

1. Generate new OpenAPI spec from backend:

   ```bash
   cd ../backend && pnpm generate:openapi
   ```

2. Copy to docs folder:

   ```bash
   cp ../backend/openapi.json ./openapi.json
   ```

3. Restart the dev server

## 🎨 Customization

### Colors

Update colors in `mint.json`:

```json
{
  "colors": {
    "primary": "#0D9373",
    "light": "#07C983",
    "dark": "#0D9373",
    "anchors": {
      "from": "#0D9373",
      "to": "#07C983"
    }
  }
}
```

### Logo

Replace files in the `logo/` directory:

- `dark.svg` - Logo for dark mode
- `light.svg` - Logo for light mode

### Favicon

Replace `favicon.svg` with your own favicon.

## 📝 Writing Documentation

### MDX Format

Documentation uses MDX (Markdown + JSX):

````mdx
# Page Title

Regular markdown content.

<Note>This is a note callout.</Note>

<Warning>This is a warning callout.</Warning>

<CodeGroup>
```javascript
const response = await fetch('/api');
````

```python
response = requests.get('/api')
```

</CodeGroup>
```

### Components

Mintlify provides built-in components:

| Component          | Usage                |
| ------------------ | -------------------- |
| `<Note>`           | Information callout  |
| `<Warning>`        | Warning callout      |
| `<Tip>`            | Tip callout          |
| `<Card>`           | Card component       |
| `<CardGroup>`      | Grid of cards        |
| `<CodeGroup>`      | Tabbed code blocks   |
| `<Steps>`          | Step-by-step guide   |
| `<RequestExample>` | API request examples |

## 🐳 Docker

### Development

```bash
# From project root
docker compose -f docker-compose.dev.yml up docs-dev
```

### Production

```bash
# Build image
docker build -t docs:latest .

# Run container
docker run -p 3000:3000 docs:latest
```

### Dockerfile

```dockerfile
FROM node:20-alpine

WORKDIR /app

RUN npm install -g mintlify

COPY . .

EXPOSE 3000

CMD ["mintlify", "dev", "--host", "0.0.0.0"]
```

## 🔄 Syncing with Backend

To keep docs in sync with the backend API:

### Automatic (CI/CD)

Add to your GitHub Actions workflow:

```yaml
- name: Generate OpenAPI spec
  working-directory: ./backend
  run: pnpm generate:openapi

- name: Copy OpenAPI to docs
  run: cp backend/openapi.json docs/openapi.json
```

### Manual

```bash
# From project root
cd backend && pnpm generate:openapi
cp backend/openapi.json docs/openapi.json
```

## 🌐 Deployment

### Mintlify Hosting

1. Push to GitHub
2. Connect repository to Mintlify dashboard
3. Automatic deployments on push

### Self-Hosted

```bash
# Build static files
mintlify build

# Serve with any static file server
npx serve build
```

## 📚 Resources

- [Mintlify Documentation](https://mintlify.com/docs)
- [OpenAPI Specification](https://swagger.io/specification/)
- [MDX Documentation](https://mdxjs.com/)
