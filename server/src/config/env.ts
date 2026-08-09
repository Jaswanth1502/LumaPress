import dotenv from 'dotenv';
import path from 'path';
import { z } from 'zod';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const envSchema = z.object({
  PORT: z.string().default('5000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  MONGODB_URI: z.string().default('mongodb://127.0.0.1:27017/lumapress'),
  JWT_SECRET: z.string().default('lumapress_super_secret_jwt_key_2026_change_in_production'),
  CLIENT_URL: z.string().default('http://localhost:5173'),
});

export const env = envSchema.parse(process.env);
