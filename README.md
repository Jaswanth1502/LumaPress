# LumaPress — Full-Stack Editorial Publishing Platform

[![GitHub Repo](https://img.shields.io/badge/GitHub-Jaswanth1502%2FLumaPress-10b981?style=for-the-badge&logo=github)](https://github.com/Jaswanth1502/LumaPress.git)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.0-61dafb?style=for-the-badge&logo=react)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4.0-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-4.21-000000?style=for-the-badge&logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose--8-47a248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)

**LumaPress** is a modern, responsive, secure, and production-ready full-stack editorial publishing platform. Built with React 19, TypeScript, Tailwind CSS v4, Express, MongoDB (Mongoose), and HTTP-only JWT authentication, LumaPress offers a clean, distraction-free environment for authors and readers.

---

## 🌟 Key Features & Visual Design

### 🎨 Editorial Aesthetic & Color Palette
- **Forest Emerald & Lime Green Palette**:
  - Headings: Deep Emerald Green (`#064e3b`).
  - Italic Emphasis: Vibrant Lime/Olive Green (`#65a30d`).
  - Primary Action Buttons: Solid Forest Emerald (`#0d5c3a`).
  - Hero CTA Banners & Footers: Deep Dark Emerald (`#0d5435`).
- **Concentric Pastel Ring Card Design**: Fallback thumbnail graphics featuring concentric radial geometric rings and author initial badges when custom cover images are not provided.
- **Typography Pairing**: Serif headers (`Playfair Display`) paired with clean body text (`Inter`).

### 🔑 Authentication & Password Policy
- **HTTP-Only JWT Authentication**: Tokens stored securely in HTTP-only, `sameSite: 'lax'` cookies.
- **Unique Password Enforcement**: Password hashing & database checking ensure no duplicate/repeated passwords across registered accounts.
- **Google / Valid Email Validation**: Restricts registration to valid Google-verified domain email formats.
- **One-Click Demo Auto-Fill**: "AUTO-FILL (JANE)" button on the Login page instantly populates demo author credentials.

### 📝 Publishing & Media Capabilities
- **Dual Cover Image Input**: Accepts pasted external image URLs or direct uploads from local device media (with instant preview & file size validation).
- **Markdown Editorial Engine**: Write and render rich markdown content with headers, blockquotes, code blocks, lists, and images.
- **Automatic Metadata**: Auto-calculated reading time, tags, unique slug generation, and excerpt character counters.
- **Post Lifecycle**: Drafts and Published status toggle. Authors retain full control over their own content.

### 📖 Explore & Dedicated "Our Story" Page
- **Explore Hub**: Search by keyword/writer, filter by topic pills (*Creativity*, *Technology*, *Mindful living*, *Design*, *Culture*, *Ideas*, *Travel*), sort by newest/oldest, with pagination.
- **Our Story Page (`/our-story`)**: Highlights core publishing philosophy:
  1. *01 Depth over velocity*
  2. *02 People over metrics*
  3. *03 Clarity over clutter*
- **Smart Navigation Bar**: "Our Story" and "Explore" menu items dynamically hide on login and sign-up pages to keep authentication focused.

---

## 📊 Codebase Statistics

- **Total Source Lines**: **6,981 lines of handwritten code** across **83 files** (15,549 lines including lockfile).
- **Frontend (`/client`)**: 4,067 lines (React 19, Vite 6, Tailwind CSS v4, TanStack Query, React Hook Form).
- **Backend (`/server`)**: 1,971 lines (Express, Mongoose 8, Zod schemas, JWT, rate limiters, security middleware).
- **E2E Tests (`/e2e`)**: 114 lines (Playwright end-to-end user journeys).
- **Test Suite Pass Rate**: **100% (18/18 unit & integration tests passing)**.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | React 19, TypeScript, Vite 6, Tailwind CSS v4, React Router v6, TanStack Query v5, React Hook Form + Zod, Axios, Lucide React, React Markdown, Sonner |
| **Backend** | Node.js, Express.js 4.21, TypeScript, MongoDB, Mongoose 8, JWT (HTTP-Only Cookie), bcryptjs, Zod, Helmet, express-rate-limit, sanitize-html |
| **Testing** | Vitest & React Testing Library (Frontend UI), Vitest & Supertest (Backend REST API), Playwright (E2E) |

---

## 📁 Monorepo Project Structure

```text
LumaPress/
├── client/                        # React 19 Frontend (Vite + TypeScript + Tailwind CSS v4)
│   ├── src/
│   │   ├── api/                   # Axios API service modules (auth, posts, comments, users)
│   │   ├── components/            # UI Components (Navbar, PostCard, ImageInput, TagBadge, Skeletons, Modals)
│   │   ├── context/               # AuthContext providing global session state
│   │   ├── layouts/               # RootLayout wrapper
│   │   ├── pages/                 # Home, Explore, OurStory, PostDetail, CreatePost, EditPost, Dashboard, Profile, Login, Register
│   │   ├── routes/                # AppRoutes & ProtectedRoute guard
│   │   ├── tests/                 # Vitest + React Testing Library component tests
│   │   ├── types/                 # TypeScript data interfaces
│   │   └── index.css              # Custom Tailwind CSS v4 design tokens & glassmorphism utilities
│   ├── package.json
│   └── vite.config.ts
├── server/                        # Express Backend API (Node.js + TS + Mongoose)
│   ├── src/
│   │   ├── config/                # Environment configuration & MongoDB connector
│   │   ├── controllers/           # Auth, Post, Comment, User controllers
│   │   ├── middleware/            # Auth guard, Zod validator, Rate limiter, Error handler
│   │   ├── models/                # User, Post, Comment Mongoose schemas
│   │   ├── routes/                # REST API endpoints
│   │   ├── schemas/               # Zod validation schemas
│   │   ├── scripts/               # Database seed script (`seed.ts`)
│   │   ├── tests/                 # Vitest + Supertest API integration tests
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

## 📡 REST API Endpoints

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

Use these pre-seeded accounts to test authentication, auto-fill, ownership controls, and comments:

| Role | Email | Password | Features |
| :--- | :--- | :--- | :--- |
| **Demo Author (Jane)** | `jane@example.com` | `Author123!` | Pre-seeded published articles & comments (One-click Auto-Fill available on Login page) |
| **Demo Admin (John)** | `john@example.com` | `Admin123!` | Pre-seeded published articles & drafts |

---

## ⚡ Quick Start & Installation

### 1. Prerequisites
- **Node.js**: v18+ (Recommended v20+)
- **MongoDB**: Local MongoDB instance running on `mongodb://127.0.0.1:27017/lumapress` (or MongoDB Atlas string)

### 2. Install Monorepo Dependencies
```bash
git clone https://github.com/Jaswanth1502/LumaPress.git
cd LumaPress
npm install
```

### 3. Environment Setup
Copy `.env.example` to `server/.env`:
```bash
cp .env.example server/.env
```

`server/.env`:
```env
PORT=5050
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/lumapress
JWT_SECRET=lumapress_super_secret_jwt_key_2026_change_in_production
CLIENT_URL=http://localhost:3030
```

### 4. Seed the Database
Populate MongoDB with demo authors, published posts, drafts, and comments:
```bash
npm run seed
```

### 5. Start Development Servers
```bash
npm run dev
```
- **Frontend App**: [http://localhost:3030](http://localhost:3030)
- **Backend API**: [http://localhost:5050/api](http://localhost:5050/api)

---

## 🧪 Testing Commands

### Run Monorepo Test Suites
```bash
npm run test
```

### Run Backend REST API Tests
```bash
npm run test --workspace=server
```

### Run Frontend Component Tests
```bash
npm run test --workspace=client
```

### Run Playwright E2E Tests
```bash
npm run test:e2e
```

---

## 🏗️ Production Build

To compile TypeScript and build production bundle:
```bash
npm run build
```

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for details.
