import { createHTTPServer } from '@trpc/server/adapters/standalone';
import { appRouter } from './trpc/router';
import logger from '../shared/logger';

// Create HTTP server with CORS enabled
const server = createHTTPServer({
  router: appRouter,
  createContext: () => ({}), // Empty context for now
  middleware: (req, res, next) => {
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

const PORT = process.env.PORT || 3002;

server.listen(PORT, () => {
  logger.info(`🚀 tRPC server listening on port ${PORT}`);
  logger.info(`📡 API endpoint: http://localhost:${PORT}`);
});

export { server };
