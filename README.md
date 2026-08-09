# LumaPress — Full-Stack Editorial Blogging Platform

**LumaPress** is a modern, responsive, secure, and production-ready full-stack editorial blogging platform built with React, TypeScript, Tailwind CSS, Express, MongoDB (Mongoose), and JWT authentication stored in HTTP-only cookies.

---

## 🌟 Overview & Features

### Core Capabilities
- **Authentication & Authorization**: Secure registration, login, logout, and session persistence via HTTP-only JWT cookies. Server-enforced ownership ensures users can only edit or delete their own posts and comments.
- **Editorial Experience**: Warm off-white color palette (`#FDFBF7`), subtle glassmorphism (`backdrop-filter: blur()`), serif typography for article headers (`Playfair Display`), and clean sans-serif UI (`Inter`).
- **Post Lifecycle**: Create, edit, preview, publish, and save posts as drafts. Automatic reading time calculation, tag categorization, and unique slug generation.
- **Public & Author Feeds**: Public landing page with featured articles, latest publications, search, tag filtering, sorting (newest/oldest), and server-side pagination.
- **Real-time Comments**: Authenticated commenting system with cascade deletion (deleting a post cleanly removes all its associated comments).
- **Author Dashboard**: Statistics counters (total posts, published, drafts, comments received), post status toggles (publish/unpublish), search, and delete modal confirmation dialogs.
- **User Profiles**: Profile management with editable avatar URL, bio, name, and a tab displaying published articles.
- **Security & Hardening**: Helmet security headers, rate limiting on auth and comment endpoints, bcrypt password hashing (8+ chars with uppercase, lowercase, number, and special character), input sanitization, and protection against XSS and NoSQL injection.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | React 19, TypeScript, Vite 6, Tailwind CSS v4, React Router v7, TanStack Query v5, React Hook Form + Zod, Axios, Lucide React, React Markdown, Sonner |
| **Backend** | Node.js, Express.js, TypeScript, MongoDB, Mongoose 8, JWT (HTTP-Only Cookie), bcryptjs, Zod, Helmet, express-rate-limit, sanitize-html |
| **Testing** | Vitest & React Testing Library (Frontend UI), Vitest & Supertest (Backend REST API), Playwright (End-to-End User Journeys) |

---

## 📁 Monorepo Project Structure

```text
lumapress/
├── client/                        # React Frontend (Vite + TypeScript + Tailwind CSS)
│   ├── src/
│   │   ├── api/                   # Axios HTTP services (auth, posts, comments, users)
│   │   ├── assets/                # Logos & icons
│   │   ├── components/            # Reusable UI (Navbar, Footer, PostCard, Skeletons, Modals, Badges)
│   │   ├── context/               # AuthContext providing session state & user login/logout
│   │   ├── hooks/                 # Custom React hooks (useAuth)
│   │   ├── layouts/               # RootLayout wrapper
│   │   ├── pages/                 # Home, Explore, PostDetail, CreatePost, EditPost, Dashboard, Profile, Register, Login, NotFound, Forbidden
│   │   ├── routes/                # AppRoutes & ProtectedRoute guard
│   │   ├── tests/                 # Vitest + React Testing Library component tests
│   │   ├── types/                 # Frontend TypeScript data interfaces
│   │   └── utils/                 # Formatting utilities
│   ├── package.json
│   └── vite.config.ts
├── server/                        # Express Backend (Node.js + TS + Mongoose)
│   ├── src/
│   │   ├── config/                # Environment variables parser & MongoDB connector
│   │   ├── controllers/           # Auth, Post, Comment, User controllers
│   │   ├── middleware/            # Auth guard, Zod validator, Rate limiter, Error handler
│   │   ├── models/                # User, Post, Comment Mongoose schemas
│   │   ├── routes/                # REST API router definitions
│   │   ├── schemas/               # Zod validation schemas
│   │   ├── scripts/               # Database seed script (`seed.ts`)
│   │   ├── tests/                 # Vitest + Supertest API integration tests
│   │   ├── types/                 # Express Request extensions & response payload types
│   │   ├── utils/                 # JWT helper, password hasher, AppError class, HTML sanitizer
│   │   ├── app.ts                 # Express application setup
│   │   └── server.ts              # HTTP server entrypoint
│   ├── package.json
│   └── tsconfig.json
├── e2e/                           # Playwright E2E end-to-end test suite
├── .env.example                   # Environment configuration template
├── package.json                   # Monorepo root workspace scripts
└── README.md                      # Documentation
```

---

## 🗄️ Database Models

### User Model
- `name`: String, required, trimmed
- `email`: String, required, unique, lowercased, indexed
- `password`: String, bcrypt hashed (10 rounds), `select: false` by default
- `avatarUrl`: String, optional
- `bio`: String, max 500 characters, optional
- `role`: `'user' | 'admin'` (default `'user'`)
- `timestamps`: `createdAt`, `updatedAt`

### Post Model
- `title`: String, required, trimmed
- `slug`: String, required, unique, indexed (auto-generated)
- `excerpt`: String, required, max 300 characters
- `content`: String (Markdown text), required
- `coverImage`: String, optional URL
- `tags`: Array of Strings, indexed
- `status`: `'draft' | 'published'`, indexed
- `author`: ObjectId referencing `User`, required, indexed
- `readingTime`: Number (calculated automatically based on word count)
- `timestamps`: `createdAt`, `updatedAt`

### Comment Model
- `content`: String, required, trimmed
- `post`: ObjectId referencing `Post`, required, indexed
- `author`: ObjectId referencing `User`, required, indexed
- `timestamps`: `createdAt`, `updatedAt`

---

## 📡 API Endpoints

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register a new user account & set HTTP-only JWT cookie |
| `POST` | `/api/auth/login` | Public | Authenticate user & set HTTP-only JWT cookie |
| `POST` | `/api/auth/logout` | Public | Clear HTTP-only JWT cookie |
| `GET` | `/api/auth/me` | Authenticated | Fetch current user session details |
| `GET` | `/api/posts` | Public | Paginated published posts (`q`, `tag`, `sort`, `page`, `limit`) |
| `GET` | `/api/posts/me` | Authenticated | Fetch current author's posts (published & drafts) for dashboard |
| `GET` | `/api/posts/:slug` | Public/Auth | Fetch post detail by slug (drafts restricted to author) |
| `POST` | `/api/posts` | Authenticated | Create a new draft or published post |
| `PATCH` | `/api/posts/:id` | Author Only | Update an owned post |
| `PATCH` | `/api/posts/:id/status` | Author Only | Toggle post status between `draft` and `published` |
| `DELETE` | `/api/posts/:id` | Author Only | Delete owned post and its comments |
| `GET` | `/api/posts/:postId/comments` | Public | Get comments for a post sorted by newest first |
| `POST` | `/api/posts/:postId/comments` | Authenticated | Add a comment to a post |
| `DELETE` | `/api/comments/:id` | Author Only | Delete owned comment |
| `GET` | `/api/users/:id` | Public | Fetch public user profile & their published posts |
| `PATCH` | `/api/users/me` | Authenticated | Update current user's profile (name, bio, avatarUrl) |
| `GET` | `/api/health` | Public | Server health check endpoint |

---

## 🔑 Demo User Credentials

Use these pre-seeded accounts to demonstrate ownership controls and multi-user interactions:

| Role | Email | Password | Details |
| :--- | :--- | :--- | :--- |
| **Author 1 (Admin)** | `john@example.com` | `Author123!` | Has published articles & drafts |
| **Author 2** | `jane@example.com` | `Author123!` | Has published articles & comments |

---

## ⚡ Quick Start & Setup

### 1. Prerequisites
- **Node.js**: v18+ (Recommended v20+)
- **MongoDB**: Local MongoDB server running on `mongodb://127.0.0.1:27017/lumapress` (or MongoDB Atlas connection string)

### 2. Installation
Clone the repository and install monorepo dependencies:
```bash
cd lumapress
npm install
```

### 3. Environment Configuration
Copy `.env.example` to `server/.env`:
```bash
cp .env.example server/.env
```

`server/.env`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/lumapress
JWT_SECRET=lumapress_super_secret_jwt_key_2026_change_in_production
CLIENT_URL=http://localhost:5173
```

### 4. Seed the Database
Populate MongoDB with demo authors, published posts, drafts, and comments:
```bash
npm run seed
```

### 5. Run Development Servers
Start both backend API server and Vite frontend concurrently:
```bash
npm run dev
```
- **Frontend App**: `http://localhost:5173`
- **Backend API**: `http://localhost:5000/api`

---

## 🧪 Testing Commands

### Run Backend API Integration Tests
Executes 14 Vitest + Supertest API integration tests (uses isolated in-memory MongoDB):
```bash
npm run test:server
```

### Run Frontend Component Tests
Executes Vitest + React Testing Library component tests:
```bash
npm run test:client
```

### Run Monorepo Test Suites
```bash
npm run test
```

### Run Playwright E2E Tests
```bash
npm run test:e2e
```

---

## 🏗️ Production Build

To build both backend TypeScript and frontend Vite assets for production:
```bash
npm run build
```

To run the production backend server:
```bash
npm run dev:server
```

---

## 🔒 Security Summary
- **Cookie Security**: Auth token stored in HTTP-only, `sameSite: 'lax'` (or `'none'` in production over HTTPS), `secure: true` in production.
- **Content Sanitization**: Markdown and HTML sanitized with `sanitize-html` to neutralize XSS vectors.
- **Database Injection**: Strict Mongoose schema casting and parameterized Zod validation protect against NoSQL injections.
- **Rate Limiting**: Auth endpoints (max 20 attempts / 15 min) and comment creation endpoints (max 30 / 10 min) are rate-limited per IP.
