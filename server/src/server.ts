import app from './app.js';
import { connectDB } from './config/db.js';
import { env } from './config/env.js';

const startServer = async () => {
  await connectDB();
  const PORT = parseInt(env.PORT, 10) || 5000;

  app.listen(PORT, () => {
    console.log(`[LumaPress Server] Server running in ${env.NODE_ENV} mode on port ${PORT}`);
  });
};

startServer();
