# Frontend Application

A modern React application built with Vite, TypeScript, and Tailwind CSS, featuring authentication, responsive design, and a beautiful UI.

## � Table of Contents

- [Features](#-features)
- [Project Structure](#-project-structure)
- [Tech Stack](#️-tech-stack)
- [Prerequisites](#-prerequisites)
- [Quick Start](#-quick-start)
- [Available Scripts](#-available-scripts)
- [UI Components](#-ui-components)
- [Authentication](#-authentication)
- [API Client](#-api-client)
- [Pages](#-pages)
- [Docker](#-docker)
- [Styling](#-styling)
- [Responsive Design](#-responsive-design)
- [Configuration](#-configuration)
- [Building for Production](#-building-for-production)
- [License](#-license)

## �🚀 Features

- **React 19** - Latest React with concurrent features
- **TypeScript** - Full type safety
- **Vite** - Lightning-fast development and builds
- **Tailwind CSS** - Utility-first styling
- **React Router v7** - Client-side routing
- **TanStack Query** - Powerful data fetching and caching
- **Axios** - HTTP client with interceptors
- **Radix UI** - Accessible component primitives
- **Framer Motion** - Smooth animations
- **Sonner** - Beautiful toast notifications

## 📁 Project Structure

```
frontend/
├── public/                      # Static assets
├── src/
│   ├── assets/                  # Images, fonts, etc.
│   ├── components/              # Reusable components
│   │   └── ui/                  # UI primitives
│   │       ├── button.component.tsx
│   │       ├── checkbox.component.tsx
│   │       ├── input.component.tsx
│   │       ├── label.component.tsx
│   │       ├── loader.component.tsx
│   │       └── sonner.component.tsx
│   ├── context/                 # React contexts
│   │   └── auth.context.ts      # Auth state context
│   ├── hooks/                   # Custom hooks
│   │   └── auth.hook.ts         # Auth hook
│   ├── layouts/                 # Page layouts
│   │   ├── auth.layout.tsx      # Auth pages layout
│   │   └── root.layout.tsx      # Main app layout
│   ├── lib/                     # Utilities
│   │   ├── client.ts            # Axios instance
│   │   ├── global-types.ts      # Shared types
│   │   └── utils.ts             # Helper functions
│   ├── pages/                   # Page components
│   │   ├── dashboard.page.tsx   # Dashboard page
│   │   ├── login.page.tsx       # Login page
│   │   └── register.page.tsx    # Register page
│   ├── providers/               # Context providers
│   │   └── Auth.provider.tsx    # Auth provider
│   ├── App.tsx                  # App component
│   ├── main.tsx                 # Entry point
│   ├── routes.tsx               # Route definitions
│   └── index.css                # Global styles
├── Dockerfile                   # Production Docker image
├── Development.Dockerfile       # Development Docker image
└── nginx.conf                   # Nginx config for production
```

## 🛠️ Tech Stack

| Technology     | Purpose               |
| -------------- | --------------------- |
| React 19       | UI framework          |
| TypeScript     | Type safety           |
| Vite           | Build tool            |
| Tailwind CSS   | Styling               |
| React Router   | Routing               |
| TanStack Query | Data fetching         |
| Axios          | HTTP client           |
| Radix UI       | Accessible components |
| Framer Motion  | Animations            |
| Lucide React   | Icons                 |

## 📋 Prerequisites

- Node.js 20+
- pnpm 9+

## 🚀 Quick Start

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Configure Environment

Create a `.env` file in the frontend directory:

```env
VITE_BACKEND_URL=http://localhost:5000
```

### 3. Start Development Server

```bash
pnpm dev
```

The app will be available at `http://localhost:5173`

## 📜 Available Scripts

| Script         | Description              |
| -------------- | ------------------------ |
| `pnpm dev`     | Start development server |
| `pnpm build`   | Build for production     |
| `pnpm preview` | Preview production build |
| `pnpm lint`    | Lint code                |

## 🎨 UI Components

### Button

```tsx
import { Button } from '@/components/ui/button.component';

<Button variant="default">Click me</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Cancel</Button>
<Button variant="ghost">Ghost</Button>
<Button isLoading>Loading...</Button>
```

### Input

```tsx
import { Input } from '@/components/ui/input.component';

<Input type="email" placeholder="Enter email" />
<Input type="password" placeholder="Enter password" />
```

### Checkbox

```tsx
import { Checkbox } from '@/components/ui/checkbox.component';

<Checkbox id="terms" />
<label htmlFor="terms">Accept terms</label>
```

### Toast Notifications

```tsx
import { toast } from "sonner";

toast.success("Operation successful");
toast.error("Something went wrong");
toast.info("Information message");
```

## 🔐 Authentication

### Auth Context

```tsx
import { useAuth } from "@/hooks/auth.hook";

function MyComponent() {
  const { user, isLoading, login, logout, register } = useAuth();

  if (isLoading) return <Loader />;

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <Dashboard user={user} />;
}
```

### Protected Routes

Routes are protected in `routes.tsx` using the auth context. Unauthenticated users are redirected to the login page.

## 📡 API Client

### Configuration

The Axios client is configured in `src/lib/client.ts`:

```typescript
import client from "@/lib/client";

// GET request
const users = await client.get("/auth/users");

// POST request
const response = await client.post("/auth/login", {
  email: "user@example.com",
  password: "Password1!",
});
```

### Features

- Base URL from environment variable
- Automatic JSON content type
- Credentials included for cookies
- Error interceptors

## 🎯 Pages

### Login Page (`/login`)

- Email and password fields
- Form validation
- Remember me checkbox
- Link to register page

### Register Page (`/register`)

- Full name, email, password fields
- Password requirements display
- Form validation
- Link to login page

### Dashboard (`/`)

- Protected route
- Displays user information
- Logout functionality

## 🐳 Docker

### Development

```bash
# From project root
docker compose -f docker-compose.dev.yml up frontend-dev
```

### Production

```bash
# Build image
docker build -t frontend:latest .

# Run container
docker run -p 80:80 frontend:latest
```

### Nginx Configuration

Production builds are served with Nginx, configured to:

- Serve static files
- Handle SPA routing (redirect to index.html)
- Gzip compression
- Security headers

## 🎨 Styling

### Tailwind CSS

The project uses Tailwind CSS with a custom configuration:

```typescript
// tailwind.config.ts
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      // Custom theme extensions
    },
  },
  plugins: [],
};
```

### CSS Variables

Custom CSS variables are defined in `index.css` for theming:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  /* ... more variables */
}
```

## 📱 Responsive Design

The app is fully responsive with breakpoints:

| Breakpoint | Width  |
| ---------- | ------ |
| `sm`       | 640px  |
| `md`       | 768px  |
| `lg`       | 1024px |
| `xl`       | 1280px |
| `2xl`      | 1536px |

## 🔧 Configuration

### Environment Variables

| Variable           | Description     | Default |
| ------------------ | --------------- | ------- |
| `VITE_BACKEND_URL` | Backend API URL | -       |

### Vite Configuration

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
});
```

## 🧪 Building for Production

```bash
# Build
pnpm build

# Preview locally
pnpm preview
```

Build output is in the `dist/` directory.
