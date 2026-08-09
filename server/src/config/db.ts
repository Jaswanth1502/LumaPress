import mongoose from 'mongoose';
import { env } from './env.js';

export const connectDB = async (customUri?: string) => {
  try {
    const uri = customUri || env.MONGODB_URI;
    const conn = await mongoose.connect(uri);
    if (env.NODE_ENV !== 'test') {
      console.log(`[MongoDB] Connected: ${conn.connection.host}/${conn.connection.name}`);
    }
    return conn;
  } catch (error) {
    console.error('[MongoDB Connection Error]:', error);
    process.exit(1);
  }
};
