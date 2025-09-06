import pino from 'pino';

// Configure Pino logger with pretty printing for development
const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'yyyy-mm-dd HH:MM:ss',
      ignore: 'pid,hostname',
      messageFormat: '{msg}',
      levelFirst: true
    }
  }
});

export default logger;
