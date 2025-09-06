import { createHTTPServer } from "@trpc/server/adapters/standalone";
import { appRouter } from "./api/trpc/router";
import logger from "./shared/logger";

// Create HTTP server
const server = createHTTPServer({
  router: appRouter,
  createContext: () => ({}), // Empty context for now
});

const PORT = process.env.PORT || 3002;

server.listen(PORT, () => {
  logger.info(`🚀 tRPC server listening on port ${PORT}`);
  logger.info(`📡 API endpoint: http://localhost:${PORT}`);
});

export { server };
