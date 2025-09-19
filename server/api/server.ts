import { createHTTPServer } from '@trpc/server/adapters/standalone';
import { appRouter } from './trpc/router';
import logger from '../shared/logger';

// Enhanced error handling and logging
process.on('uncaughtException', (error) => {
  logger.error({ error }, 'Uncaught Exception');
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error({ reason, promise }, 'Unhandled Rejection');
  process.exit(1);
});

// Create HTTP server with CORS enabled
const server = createHTTPServer({
  router: appRouter,
  createContext: () => ({}), // Empty context for now
  middleware: (req, res, next) => {
    // Log incoming requests
    logger.info({
      method: req.method,
      url: req.url,
      userAgent: req.headers['user-agent'],
      ip: req.headers['x-forwarded-for'] || req.connection?.remoteAddress
    }, `${req.method} ${req.url}`);

    // Enable CORS for all origins (you can restrict this to specific origins in production)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      res.writeHead(200);
      res.end();
      return;
    }
    
    next();
  },
});

// Railway provides PORT environment variable, fallback to 3002 for local development
const PORT = process.env.PORT || 3002;
const HOST = process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost';

logger.info({
  port: PORT,
  host: HOST,
  nodeEnv: process.env.NODE_ENV,
  databaseUrl: process.env.DATABASE_URL
}, '🚀 Starting tRPC server...');

server.listen(Number(PORT), () => {
  logger.info({
    port: PORT,
    host: HOST,
    endpoint: process.env.NODE_ENV === 'production' 
      ? `Server running on port ${PORT}` 
      : `http://localhost:${PORT}`
  }, '✅ tRPC server successfully started!');
}).on('error', (error: any) => {
  if (error.code === 'EADDRINUSE') {
    logger.error({
      port: PORT,
      error: error.message
    }, `❌ Port ${PORT} is already in use. Please check if another process is running on this port.`);
  } else {
    logger.error({ error }, '❌ Server failed to start');
  }
  process.exit(1);
});

export { server };
