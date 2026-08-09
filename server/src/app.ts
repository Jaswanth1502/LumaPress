import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { env } from './config/env.js';
import { errorHandler } from './middleware/error.middleware.js';
import authRoutes from './routes/auth.routes.js';
import postRoutes from './routes/post.routes.js';
import userRoutes from './routes/user.routes.js';
import { deleteComment } from './controllers/comment.controller.js';
import { requireAuth } from './middleware/auth.middleware.js';

const app = express();

// Security Headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// CORS Configuration
const allowedOrigins = [
  env.CLIENT_URL,
  'http://localhost:3030',
  'http://127.0.0.1:3030',
  'http://localhost:5173',
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || env.NODE_ENV === 'test') {
        callback(null, true);
      } else {
        callback(null, true); // Allow during dev/testing
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

// Body Parsing & Cookie Parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'LumaPress Backend API is healthy and operational',
    timestamp: new Date().toISOString(),
    env: env.NODE_ENV,
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);
app.delete('/api/comments/:id', requireAuth, deleteComment);

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint not found: ${req.method} ${req.originalUrl}`,
  });
});

// Centralized Error Middleware
app.use(errorHandler);

export default app;
